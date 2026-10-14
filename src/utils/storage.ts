import { STORAGE_KEYS, STORAGE_VERSION, type StorageKey } from '../types'

export const STORAGE_EVENT = 'ekw:storage-change'
let storageUser: string | null = null
export function getStorageUser() { return storageUser }
export function storageAddress(key: StorageKey, userId = storageUser) {
  return userId ? `${key}:user:${userId}` : key
}
function notify(local = true) {
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { local, userId: storageUser } }))
}
export function setStorageUser(userId: string | null) {
  if (storageUser === userId) return
  storageUser = userId
  notify(false)
}
export function readRaw(key: StorageKey, userId = storageUser): string | null {
  try { return window.localStorage.getItem(storageAddress(key, userId)) } catch { return null }
}
export function load<T>(key: StorageKey, fallback: T): T {
  try {
    const raw = readRaw(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    if (parsed && parsed.v === STORAGE_VERSION && 'data' in parsed) return parsed.data as T
    // Keep legacy offline lookup history without a version wrapper.
    if (key === STORAGE_KEYS.dictHistory && parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as T
    return fallback
  } catch { return fallback }
}
export function save<T>(key: StorageKey, data: T): boolean {
  try {
    window.localStorage.setItem(storageAddress(key), JSON.stringify({ v: STORAGE_VERSION, data }))
    notify()
    return true
  } catch {
    window.alert("Data save failed: browser storage is unavailable or full. Please export a backup first, then free up space.")
    return false
  }
}
export function remove(key: StorageKey) {
  try { window.localStorage.removeItem(storageAddress(key)); notify() } catch { /* Storage unavailable */ }
}
export function estimateUsage(): number {
  return Object.values(STORAGE_KEYS).reduce((sum, key) => sum + (readRaw(key)?.length ?? 0) * 2, 0)
}
export function exportAll(userId = storageUser): string {
  const out: Record<string, unknown> = {}
  for (const key of Object.values(STORAGE_KEYS)) {
    const raw = readRaw(key, userId)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        out[key] = key === STORAGE_KEYS.dictHistory && parsed?.v === undefined
          ? { v: STORAGE_VERSION, data: parsed } : parsed
      } catch { throw new Error(` Data is corrupted and cannot be exported:${key}`) }
    }
  }
  return JSON.stringify(out, null, 2)
}
/* Validate the complete backup before writing; roll back failed writes. */
export function importAll(json: string): string[] {
  let data: Record<string, unknown>
  try {
    data = JSON.parse(json)
    if (!data || typeof data !== 'object' || Array.isArray(data)) return ["Backup must be a JSON object"]
  } catch { return ["Backup file is not valid JSON"] }
  const entries: [StorageKey, string][] = []
  const arrays: StorageKey[] = [STORAGE_KEYS.questions, STORAGE_KEYS.sessions, STORAGE_KEYS.wrongRecords, STORAGE_KEYS.vocab, STORAGE_KEYS.patterns]
  for (const key of Object.values(STORAGE_KEYS)) {
    if (!(key in data)) continue
    const wrapped = data[key] as { v?: unknown; data?: unknown } | null
    if (!wrapped || wrapped.v !== STORAGE_VERSION || !('data' in wrapped)) return [` Backup version or format is incorrect:${key}`]
    const value = wrapped.data
    if (arrays.includes(key) ? !Array.isArray(value) : !value || typeof value !== 'object' || Array.isArray(value)) return [` Data type is incorrect:${key}`]
    entries.push([key, JSON.stringify(wrapped)])
  }
  if (!entries.length) return ["File does not contain study data"]
  const previous = entries.map(([key]) => [storageAddress(key), readRaw(key)] as const)
  try {
    for (const [key, value] of entries) window.localStorage.setItem(storageAddress(key), value)
  } catch {
    for (const [address, raw] of previous) {
      try { if (raw === null) window.localStorage.removeItem(address); else window.localStorage.setItem(address, raw) } catch { /* Best-effort rollback */ }
    }
    return ["Browser storage write failed; attempted to restore original data"]
  }
  notify(false)
  return []
}
