import { STORAGE_KEYS, STORAGE_VERSION, type StorageKey } from '../types'

interface Wrapped<T> {
  v: number
  data: T
}

/**
 * localStorage 封装：统一前缀、版本号、异常捕获。
 * localStorage 禁用或写满时静默失败并提示，不崩溃页面。
 */
export function load<T>(key: StorageKey, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Wrapped<T>
    if (parsed && typeof parsed === 'object' && parsed.v === STORAGE_VERSION) {
      return parsed.data
    }
    return fallback
  } catch {
    return fallback
  }
}

export function save<T>(key: StorageKey, data: T): boolean {
  try {
    const wrapped: Wrapped<T> = { v: STORAGE_VERSION, data }
    window.localStorage.setItem(key, JSON.stringify(wrapped))
    return true
  } catch {
    window.alert('数据保存失败：浏览器存储不可用或已满。请清理浏览器数据后重试。')
    return false
  }
}

export function remove(key: StorageKey): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // 忽略
  }
}

/** 估算当前占用（字节） */
export function estimateUsage(): number {
  let total = 0
  for (const key of Object.values(STORAGE_KEYS)) {
    const raw = window.localStorage.getItem(key)
    if (raw) total += raw.length * 2 // UTF-16 每字符约 2 字节
  }
  return total
}

/** 导出全部数据（备份用） */
export function exportAll(): string {
  const out: Record<string, unknown> = {}
  for (const key of Object.values(STORAGE_KEYS)) {
    const raw = window.localStorage.getItem(key)
    if (raw) out[key] = JSON.parse(raw)
  }
  return JSON.stringify(out, null, 2)
}

/** 导入备份，返回失败的 key 列表 */
export function importAll(json: string): string[] {
  const failed: string[] = []
  try {
    const data = JSON.parse(json) as Record<string, unknown>
    for (const key of Object.values(STORAGE_KEYS)) {
      const value = data[key]
      if (value !== undefined && value !== null) {
        try {
          window.localStorage.setItem(key, JSON.stringify(value))
        } catch {
          failed.push(key)
        }
      }
    }
  } catch {
    return ['（备份文件不是有效的 JSON）']
  }
  return failed
}
