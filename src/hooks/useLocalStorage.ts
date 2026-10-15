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
/* All components read the same snapshot; after the write sync completes, notify subscribers. */
export function useLocalStorage<T>(key: StorageKey, fallback: T) {
  const owner = getStorageUser()
  const fallbackRef = useRef(fallback)
  fallbackRef.current = fallback
  const cache = useRef<{ key: StorageKey; raw: string | null; user: string | null; value: T }>()
  const snapshot = useCallback(() => {
    const raw = readRaw(key)
    const user = getStorageUser()
    if (!cache.current || cache.current.key !== key || cache.current.raw !== raw || cache.current.user !== user) {
      cache.current = { key, raw, user, value: load(key, fallbackRef.current) }
    }
    return cache.current.value
  }, [key])
  const value = useSyncExternalStore(subscribe, snapshot)
  const setValue: Dispatch<SetStateAction<T>> = useCallback((update: SetStateAction<T>) => {
    // An async action from an unmounted account must not write into the new account.
    if (getStorageUser() !== owner) return
    const next = typeof update === 'function'
      ? (update as (previous: T) => T)(load(key, fallbackRef.current)) : update
    save(key, next)
  }, [key, owner])
  return [value, setValue] as const
}
