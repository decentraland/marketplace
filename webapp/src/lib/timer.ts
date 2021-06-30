import { useState, useCallback, useRef } from 'react'

export const useTimer = (delay: number): [boolean, () => void] => {
  const [isRunning, setRunningStatus] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()

  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current)
    }
    setRunningStatus(true)
    intervalRef.current = setTimeout(() => setRunningStatus(false), delay)
  }, [intervalRef.current])

  return [isRunning, startTimer]
}
