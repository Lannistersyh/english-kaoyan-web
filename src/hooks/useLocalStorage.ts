import { useCallback, useRef, useSyncExternalStore, type Dispatch, type SetStateAction } from 'react'
import { load, save, readRaw, getStorageUser, STORAGE_EVENT } from '../utils/storage'
import type { StorageKey } from '../types'

function subscribe(listener: () => void) {
  window.addEventListener(STORAGE_EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(STORAGE_EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}
/** 所有组件读取同一份快照；写入同步完成后通知订阅者。 */
export function useLocalStorage<T>(key: StorageKey, fallback: T) {
  const fallbackRef = useRef(fallback)
  const cache = useRef<{ raw: string | null; user: string | null; value: T }>()
  const snapshot = useCallback(() => {
    const raw = readRaw(key)
    const user = getStorageUser()
    if (!cache.current || cache.current.raw !== raw || cache.current.user !== user) {
      cache.current = { raw, user, value: load(key, fallbackRef.current) }
    }
    return cache.current.value
  }, [key])
  const value = useSyncExternalStore(subscribe, snapshot)
  const setValue: Dispatch<SetStateAction<T>> = useCallback((update: SetStateAction<T>) => {
    const next = typeof update === 'function'
      ? (update as (previous: T) => T)(load(key, fallbackRef.current)) : update
    save(key, next)
  }, [key])
  return [value, setValue] as const
}
