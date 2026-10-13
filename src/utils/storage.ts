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
    // 查词历史旧版没有版本封装，保留离线历史。
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
    window.alert('数据保存失败：浏览器存储不可用或已满。请先导出备份，再清理空间。')
    return false
  }
}
export function remove(key: StorageKey) {
  try { window.localStorage.removeItem(storageAddress(key)); notify() } catch { /* 存储不可用 */ }
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
      } catch { throw new Error(`数据损坏，无法导出：${key}`) }
    }
  }
  return JSON.stringify(out, null, 2)
}
/** 验证完整备份后再写入，写入失败则回滚，避免部分恢复。 */
export function importAll(json: string): string[] {
  let data: Record<string, unknown>
  try {
    data = JSON.parse(json)
    if (!data || typeof data !== 'object' || Array.isArray(data)) return ['备份必须是 JSON 对象']
  } catch { return ['备份文件不是有效的 JSON'] }
  const entries: [StorageKey, string][] = []
  const arrays: StorageKey[] = [STORAGE_KEYS.questions, STORAGE_KEYS.sessions, STORAGE_KEYS.wrongRecords, STORAGE_KEYS.vocab, STORAGE_KEYS.patterns]
  for (const key of Object.values(STORAGE_KEYS)) {
    if (!(key in data)) continue
    const wrapped = data[key] as { v?: unknown; data?: unknown } | null
    if (!wrapped || wrapped.v !== STORAGE_VERSION || !('data' in wrapped)) return [`备份版本或格式不正确：${key}`]
    const value = wrapped.data
    if (arrays.includes(key) ? !Array.isArray(value) : !value || typeof value !== 'object' || Array.isArray(value)) return [`数据类型不正确：${key}`]
    entries.push([key, JSON.stringify(wrapped)])
  }
  if (!entries.length) return ['文件不包含学习数据']
  const previous = entries.map(([key]) => [storageAddress(key), readRaw(key)] as const)
  try {
    for (const [key, value] of entries) window.localStorage.setItem(storageAddress(key), value)
  } catch {
    for (const [address, raw] of previous) {
      try { if (raw === null) window.localStorage.removeItem(address); else window.localStorage.setItem(address, raw) } catch { /* 尽力恢复 */ }
    }
    return ['浏览器存储写入失败，已尝试恢复原数据']
  }
  notify(false)
  return []
}
