import { supabase, isCloudEnabled } from './supabase'
import { STORAGE_KEYS, STORAGE_VERSION } from '../types'
import { exportAll, importAll, getStorageUser, STORAGE_EVENT } from '../utils/storage'

export type SyncDirection = 'push' | 'pull'
export interface SyncResult { ok: boolean; direction: SyncDirection; message: string }
const wrap = (data: unknown) => ({ v: STORAGE_VERSION, data })
function normalize(value: unknown, fallback: unknown) {
  if (value && typeof value === 'object' && 'v' in value && 'data' in value) return value
  return wrap(value ?? fallback)
}
let uploadQueue: Promise<unknown> = Promise.resolve()
/* Take a snapshot at call time and upload in order, to avoid slow requests overwriting newer records. */
export function pushToCloud(): Promise<SyncResult> {
  const owner = getStorageUser()
  let snapshot: Record<string, unknown>
  try { snapshot = JSON.parse(exportAll()) } catch { return Promise.resolve({ ok: false, direction: 'push', message: "Local data cannot be exported" }) }
  const task = async (): Promise<SyncResult> => {
    if (!isCloudEnabled() || !owner) return { ok: false, direction: 'push', message: "Please log in before syncing" }
    try {
      const { data, error: sessionError } = await supabase!.auth.getSession()
      if (sessionError || data.session?.user.id !== owner || getStorageUser() !== owner) return { ok: false, direction: 'push', message: "Account has been switched; upload canceled" }
      // Put extra data into the metadata of the existing settings JSONB, for compatibility with the existing database structure.
      const settings = normalize(snapshot[STORAGE_KEYS.settings], { promptThinkingOnWrong: true }) as Record<string, unknown>
      const row = {
        user_id: owner,
        progress: normalize(snapshot[STORAGE_KEYS.progress], {}),
        sessions: normalize(snapshot[STORAGE_KEYS.sessions], []),
        wrong_records: normalize(snapshot[STORAGE_KEYS.wrongRecords], []),
        vocab: normalize(snapshot[STORAGE_KEYS.vocab], []),
        vocab_progress: normalize(snapshot[STORAGE_KEYS.vocabProgress], {}),
        imported_questions: normalize(snapshot[STORAGE_KEYS.questions], []),
        settings: { ...settings, extras: {
          patterns: normalize(snapshot[STORAGE_KEYS.patterns], []),
          dictHistory: normalize(snapshot[STORAGE_KEYS.dictHistory], {}),
        } },
      }
      const { error } = await supabase!.from('user_data').upsert(row, { onConflict: 'user_id' })
      if (error) throw error
      return { ok: true, direction: 'push', message: ` Uploaded · ${new Date().toLocaleTimeString('en-US')}` }
    } catch (err) {
      return { ok: false, direction: 'push', message: ` Upload failed:${err instanceof Error ? err.message : "Network or cloud error"}` }
    }
  }
  const result = uploadQueue.then(task, task)
  uploadQueue = result
  return result
}
export async function pullFromCloud(): Promise<SyncResult> {
  const owner = getStorageUser()
  if (!isCloudEnabled() || !owner) return { ok: false, direction: 'pull', message: "Please log in before syncing" }
  try {
    const before = exportAll()
    const { data: sessionData } = await supabase!.auth.getSession()
    if (sessionData.session?.user.id !== owner) throw new Error("Account has been switched")
    const { data: row, error } = await supabase!.from('user_data').select('*').eq('user_id', owner).maybeSingle()
    if (error) throw error
    if (getStorageUser() !== owner) throw new Error("Account has been switched; restore canceled")
    if (!row) return { ok: true, direction: 'pull', message: "No data in the cloud yet; keeping this account's local data" }
    if (before !== exportAll()) throw new Error("Local data changed during download; please complete the operation and restore again")
    window.sessionStorage.setItem(`ekw:pre-pull-backup:${owner}`, before)
    const settings = normalize(row.settings, { promptThinkingOnWrong: true }) as { extras?: Record<string, unknown> }
    const cloud: Record<string, unknown> = {
      [STORAGE_KEYS.progress]: normalize(row.progress, {}),
      [STORAGE_KEYS.sessions]: normalize(row.sessions, []),
      [STORAGE_KEYS.wrongRecords]: normalize(row.wrong_records, []),
      [STORAGE_KEYS.vocab]: normalize(row.vocab, []),
      [STORAGE_KEYS.vocabProgress]: normalize(row.vocab_progress, {}),
      [STORAGE_KEYS.questions]: normalize(row.imported_questions, []),
      [STORAGE_KEYS.settings]: settings,
    }
    // Keep local extensions when an older cloud backup has no extras.
    if (settings.extras) {
      cloud[STORAGE_KEYS.patterns] = normalize(settings.extras.patterns, [])
      cloud[STORAGE_KEYS.dictHistory] = normalize(settings.extras.dictHistory, {})
    }
    const failed = importAll(JSON.stringify(cloud), { local: false })
    if (failed.length) throw new Error(failed.join('、'))
    return { ok: true, direction: 'pull', message: "Restored from the cloud; the page has been updated" }
  } catch (err) {
    return { ok: false, direction: 'pull', message: ` Restore failed:${err instanceof Error ? err.message : "Network or cloud error"}` }
  }
}
export async function silentPush() {
  const result = await pushToCloud()
  if (!result.ok) console.warn('[sync]', result.message)
}
/* Local writes schedule uploads; restoring cloud data does not upload it again. */
export function installAutoSync() {
  let timer: number | undefined
  const listener = (event: Event) => {
    const { local, userId } = (event as CustomEvent).detail
    if (timer !== undefined) window.clearTimeout(timer)
    if (local && userId) timer = window.setTimeout(() => { if (getStorageUser() === userId) void silentPush() }, 750)
  }
  window.addEventListener(STORAGE_EVENT, listener)
  return () => { window.removeEventListener(STORAGE_EVENT, listener); if (timer !== undefined) window.clearTimeout(timer) }
}
