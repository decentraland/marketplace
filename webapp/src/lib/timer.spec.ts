import { renderHook, act } from '@testing-library/react-hooks'
import { useTimer } from './timer'

const runTimerAutomaticallyOnce = () => {
  ;((setTimeout as unknown) as jest.Mock).mockImplementationOnce(callback =>
    callback()
  )
}

jest.useFakeTimers()

describe('when initializing the hook', () => {
  it('should return isRunning as false', () => {
    const { result } = renderHook(() => useTimer(1200))
    const [isRunning] = result.current

    expect(isRunning).toBe(false)
  })
})

describe('when the timer is running', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe("and the timer hasn't finished", () => {
    it('should return isRunning as true', async () => {
      const { result } = renderHook(() => useTimer(1200))
      const [_, startTimer] = result.current

      act(() => {
        startTimer()
      })

      const [isRunning] = result.current

      expect(isRunning).toBe(true)
    })
  })

  describe('and the timer finishes', () => {
    it('should return isRunning as false', async () => {
      runTimerAutomaticallyOnce()
      const { result } = renderHook(() => useTimer(1200))
      const [_, startTimer] = result.current

      act(() => {
        startTimer()
      })

      const [isRunning] = result.current

      expect(isRunning).toBe(false)
    })
  })

  describe('and the timer is re-started', () => {
    it('should re-start the timeout procedure', () => {
      const { result } = renderHook(() => useTimer(1200))
      const [_, startTimer] = result.current

      act(() => {
        startTimer()
        startTimer()
      })

      expect(setTimeout).toBeCalledTimes(2)
    })
  })
})
