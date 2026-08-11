import { useEffect, useRef, useState } from 'react'

/** 做题计时（开始/暂停/重置），mm:ss 格式化 */
export function useTimer(active: boolean) {
  const [seconds, setSeconds] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active || paused) return
    intervalRef.current = window.setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current)
    }
  }, [active, paused])

  const reset = () => setSeconds(0)

  return { seconds, paused, setPaused, reset }
}
