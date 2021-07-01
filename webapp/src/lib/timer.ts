import { useState, useCallback, useRef } from 'react'

export const useTimer = (delay: number): [boolean, () => void] => {
  const [isRunning, setRunningStatus] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const startTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setRunningStatus(true)
    timeoutRef.current = setTimeout(() => setRunningStatus(false), delay)
  }, [timeoutRef.current])

  return [isRunning, startTimer]
}
