import { useEffect, useState } from 'react'
import { load, save } from '../utils/storage'
import type { StorageKey } from '../types'

/** 通用 localStorage 状态 hook */
export function useLocalStorage<T>(key: StorageKey, fallback: T) {
  const [value, setValue] = useState<T>(() => load(key, fallback))

  useEffect(() => {
    save(key, value)
  }, [key, value])

  return [value, setValue] as const
}
