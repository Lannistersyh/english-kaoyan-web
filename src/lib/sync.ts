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
/** 在调用时取快照，并按顺序上传，避免慢请求覆盖较新的记录。 */
export function pushToCloud(): Promise<SyncResult> {
  const owner = getStorageUser()
  let snapshot: Record<string, unknown>
  try { snapshot = JSON.parse(exportAll()) } catch { return Promise.resolve({ ok: false, direction: 'push', message: '本地数据无法导出' }) }
  const task = async (): Promise<SyncResult> => {
    if (!isCloudEnabled() || !owner) return { ok: false, direction: 'push', message: '请先登录再同步' }
    try {
      const { data, error: sessionError } = await supabase!.auth.getSession()
      if (sessionError || data.session?.user.id !== owner || getStorageUser() !== owner) return { ok: false, direction: 'push', message: '账号已切换，已取消上传' }
      // 额外数据放入现有 settings JSONB 的元数据，兼容已有数据库结构。
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
      return { ok: true, direction: 'push', message: `已上传 · ${new Date().toLocaleTimeString('zh-CN')}` }
    } catch (err) {
      return { ok: false, direction: 'push', message: `上传失败：${err instanceof Error ? err.message : '网络或云端错误'}` }
    }
  }
  const result = uploadQueue.then(task, task)
  uploadQueue = result
  return result
}
export async function pullFromCloud(): Promise<SyncResult> {
  const owner = getStorageUser()
  if (!isCloudEnabled() || !owner) return { ok: false, direction: 'pull', message: '请先登录再同步' }
  try {
    const before = exportAll()
    const { data: sessionData } = await supabase!.auth.getSession()
    if (sessionData.session?.user.id !== owner) throw new Error('账号已切换')
    const { data: row, error } = await supabase!.from('user_data').select('*').eq('user_id', owner).maybeSingle()
    if (error) throw error
    if (getStorageUser() !== owner) throw new Error('账号已切换，已取消恢复')
    if (!row) return { ok: true, direction: 'pull', message: '云端尚无数据，保留此账号本地数据' }
    if (before !== exportAll()) throw new Error('下载期间本地数据已更改，请完成操作后重新恢复')
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
    // 旧云端记录没有 extras 时保留本账号的本地扩展数据。
    if (settings.extras) {
      cloud[STORAGE_KEYS.patterns] = normalize(settings.extras.patterns, [])
      cloud[STORAGE_KEYS.dictHistory] = normalize(settings.extras.dictHistory, {})
    }
    const failed = importAll(JSON.stringify(cloud))
    if (failed.length) throw new Error(failed.join('、'))
    return { ok: true, direction: 'pull', message: '已从云端恢复，页面已更新' }
  } catch (err) {
    return { ok: false, direction: 'pull', message: `恢复失败：${err instanceof Error ? err.message : '网络或云端错误'}` }
  }
}
export async function silentPush() {
  const result = await pushToCloud()
  if (!result.ok) console.warn('[sync]', result.message)
}
/** 所有本地写入均触发同步；云端恢复不触发回传。 */
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
