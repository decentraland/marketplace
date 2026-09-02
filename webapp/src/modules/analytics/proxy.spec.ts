import { getAnalyticsProxyOptions, persistSegmentKillSwitch, SEGMENT_KILL_SWITCH_KEY } from './proxy'

const ANALYTICS_URL = 'https://evs.example.org/abc/def.min.js'
const API_HOST = 'api.e.example.org/v1'

describe('when reading the analytics proxy options', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('and the kill switch was never persisted', () => {
    it('should return the configured proxy, an unknown flag must not turn tracking off', () => {
      expect(getAnalyticsProxyOptions(ANALYTICS_URL, API_HOST)).toEqual({ analyticsUrl: ANALYTICS_URL, apiHost: API_HOST })
    })
  })

  describe('and the kill switch was persisted as off', () => {
    beforeEach(() => {
      persistSegmentKillSwitch(false)
    })

    it('should return the configured proxy', () => {
      expect(getAnalyticsProxyOptions(ANALYTICS_URL, API_HOST)).toEqual({ analyticsUrl: ANALYTICS_URL, apiHost: API_HOST })
    })
  })

  describe('and the kill switch was persisted as on', () => {
    beforeEach(() => {
      persistSegmentKillSwitch(true)
    })

    it('should return nothing, so analytics goes straight to Segment', () => {
      expect(getAnalyticsProxyOptions(ANALYTICS_URL, API_HOST)).toBeUndefined()
    })

    describe('and it is persisted as off again', () => {
      beforeEach(() => {
        persistSegmentKillSwitch(false)
      })

      it('should return the configured proxy on the next read', () => {
        expect(getAnalyticsProxyOptions(ANALYTICS_URL, API_HOST)).toEqual({ analyticsUrl: ANALYTICS_URL, apiHost: API_HOST })
      })
    })
  })

  describe('and nothing is configured', () => {
    it('should return nothing rather than empty options', () => {
      expect(getAnalyticsProxyOptions('', '')).toBeUndefined()
    })
  })

  describe('and only one of the two is configured', () => {
    it('should return just that one, the halves are independent', () => {
      expect(getAnalyticsProxyOptions(ANALYTICS_URL, '')).toEqual({ analyticsUrl: ANALYTICS_URL })
    })
  })
})

describe('when persisting the kill switch', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should store a value the next boot can read synchronously', () => {
    persistSegmentKillSwitch(true)

    expect(localStorage.getItem(SEGMENT_KILL_SWITCH_KEY)).toBe('1')
  })

  describe('and storage throws, as it does in private mode', () => {
    let setItem: jest.SpyInstance

    beforeEach(() => {
      setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })
    })

    afterEach(() => {
      setItem.mockRestore()
    })

    it('should not throw, tracking configuration is not worth breaking the app over', () => {
      expect(() => persistSegmentKillSwitch(true)).not.toThrow()
    })
  })
})
