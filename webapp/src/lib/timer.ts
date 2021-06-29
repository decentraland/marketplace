import { useState, useCallback } from 'react'

export const useTimer = (delay: number): [boolean, () => void] => {
  const [isRunning, setRunningStatus] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>(
    undefined
  )

  const startTimer = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    setRunningStatus(true)
    const newTimeoutId = setTimeout(() => setRunningStatus(false), delay)
    setTimeoutId(newTimeoutId)
  }, [timeoutId])

  return [isRunning, startTimer]
}
