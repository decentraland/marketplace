import {
  fromMillisecondsToSeconds,
  fromSecondsToMilliseconds,
  isExpired,
  isExpiredSeconds,
  getTimeRemaining,
  formatTimeRemaining,
  DURATION,
  addDaysToTimestamp,
  getStartOfDay,
  getEndOfDay,
  daysBetween,
  isWithinLastDays,
  formatRelativeTime
} from './time'

describe('Time utilities', () => {
  describe('fromMillisecondsToSeconds', () => {
    it('should convert milliseconds to seconds with floor', () => {
      expect(fromMillisecondsToSeconds(1656105118092)).toEqual(1656105118)
    })

    it('should handle round second timestamps', () => {
      expect(fromMillisecondsToSeconds(1656105118000)).toEqual(1656105118)
    })
  })

  describe('fromSecondsToMilliseconds', () => {
    it('should convert seconds to milliseconds', () => {
      expect(fromSecondsToMilliseconds(1656105118)).toEqual(1656105118000)
    })
  })

  describe('isExpired', () => {
    it('should return true when current time is past expiration', () => {
      const expiration = 1000
      const current = 2000
      expect(isExpired(expiration, current)).toBe(true)
    })

    it('should return false when current time is before expiration', () => {
      const expiration = 2000
      const current = 1000
      expect(isExpired(expiration, current)).toBe(false)
    })

    it('should return true when times are equal', () => {
      const time = 1000
      expect(isExpired(time, time)).toBe(true)
    })
  })

  describe('isExpiredSeconds', () => {
    it('should handle expiration in seconds', () => {
      const expirationSeconds = 1656105118
      const currentMs = 1656105119000 // 1 second later
      expect(isExpiredSeconds(expirationSeconds, currentMs)).toBe(true)
    })

    it('should return false when not expired', () => {
      const expirationSeconds = 1656105118
      const currentMs = 1656105117000 // 1 second before
      expect(isExpiredSeconds(expirationSeconds, currentMs)).toBe(false)
    })
  })

  describe('getTimeRemaining', () => {
    it('should return remaining time when not expired', () => {
      const expiration = 5000
      const current = 3000
      expect(getTimeRemaining(expiration, current)).toBe(2000)
    })

    it('should return 0 when expired', () => {
      const expiration = 3000
      const current = 5000
      expect(getTimeRemaining(expiration, current)).toBe(0)
    })
  })

  describe('formatTimeRemaining', () => {
    it('should format days and hours', () => {
      const twoDaysAndFiveHours = 2 * DURATION.DAY + 5 * DURATION.HOUR
      expect(formatTimeRemaining(twoDaysAndFiveHours)).toBe('2d 5h')
    })

    it('should format hours and minutes', () => {
      const threeHoursAndThirtyMinutes = 3 * DURATION.HOUR + 30 * DURATION.MINUTE
      expect(formatTimeRemaining(threeHoursAndThirtyMinutes)).toBe('3h 30m')
    })

    it('should format minutes only', () => {
      const fortyFiveMinutes = 45 * DURATION.MINUTE
      expect(formatTimeRemaining(fortyFiveMinutes)).toBe('45m')
    })

    it('should format seconds only', () => {
      const thirtySeconds = 30 * DURATION.SECOND
      expect(formatTimeRemaining(thirtySeconds)).toBe('30s')
    })

    it('should return Expired for zero or negative', () => {
      expect(formatTimeRemaining(0)).toBe('Expired')
      expect(formatTimeRemaining(-1000)).toBe('Expired')
    })

    it('should handle days without remaining hours', () => {
      const exactlyThreeDays = 3 * DURATION.DAY
      expect(formatTimeRemaining(exactlyThreeDays)).toBe('3d')
    })
  })

  describe('DURATION constants', () => {
    it('should have correct values', () => {
      expect(DURATION.SECOND).toBe(1000)
      expect(DURATION.MINUTE).toBe(60000)
      expect(DURATION.HOUR).toBe(3600000)
      expect(DURATION.DAY).toBe(86400000)
      expect(DURATION.WEEK).toBe(604800000)
    })
  })

  describe('addDaysToTimestamp', () => {
    it('should add days to a timestamp', () => {
      const base = 1000000000000
      const result = addDaysToTimestamp(base, 5)
      expect(result).toBe(base + 5 * DURATION.DAY)
    })

    it('should handle negative days', () => {
      const base = 1000000000000
      const result = addDaysToTimestamp(base, -3)
      expect(result).toBe(base - 3 * DURATION.DAY)
    })
  })

  describe('getStartOfDay', () => {
    it('should return start of day', () => {
      // Create a date at noon
      const noon = new Date('2024-01-15T12:30:45.123Z').getTime()
      const startOfDay = getStartOfDay(noon)
      const date = new Date(startOfDay)
      expect(date.getHours()).toBe(0)
      expect(date.getMinutes()).toBe(0)
      expect(date.getSeconds()).toBe(0)
      expect(date.getMilliseconds()).toBe(0)
    })
  })

  describe('getEndOfDay', () => {
    it('should return end of day', () => {
      const noon = new Date('2024-01-15T12:30:45.123Z').getTime()
      const endOfDay = getEndOfDay(noon)
      const date = new Date(endOfDay)
      expect(date.getHours()).toBe(23)
      expect(date.getMinutes()).toBe(59)
      expect(date.getSeconds()).toBe(59)
      expect(date.getMilliseconds()).toBe(999)
    })
  })

  describe('daysBetween', () => {
    it('should calculate days between two timestamps', () => {
      const start = 1000000000000
      const end = start + 5 * DURATION.DAY
      expect(daysBetween(start, end)).toBe(5)
    })

    it('should handle reversed order', () => {
      const start = 1000000000000
      const end = start + 5 * DURATION.DAY
      expect(daysBetween(end, start)).toBe(5)
    })

    it('should return fractional days', () => {
      const start = 1000000000000
      const end = start + 2.5 * DURATION.DAY
      expect(daysBetween(start, end)).toBe(2.5)
    })
  })

  describe('isWithinLastDays', () => {
    const now = 1000000000000

    it('should return true for recent timestamps', () => {
      const recent = now - 2 * DURATION.DAY
      expect(isWithinLastDays(recent, 7, now)).toBe(true)
    })

    it('should return false for old timestamps', () => {
      const old = now - 10 * DURATION.DAY
      expect(isWithinLastDays(old, 7, now)).toBe(false)
    })

    it('should return true for exact boundary', () => {
      const boundary = now - 7 * DURATION.DAY
      expect(isWithinLastDays(boundary, 7, now)).toBe(true)
    })
  })

  describe('formatRelativeTime', () => {
    const now = 1000000000000

    it('should format past times in minutes', () => {
      const fiveMinutesAgo = now - 5 * DURATION.MINUTE
      expect(formatRelativeTime(fiveMinutesAgo, now)).toBe('5 minutes ago')
    })

    it('should format past times in hours', () => {
      const twoHoursAgo = now - 2 * DURATION.HOUR
      expect(formatRelativeTime(twoHoursAgo, now)).toBe('2 hours ago')
    })

    it('should format past times in days', () => {
      const threeDaysAgo = now - 3 * DURATION.DAY
      expect(formatRelativeTime(threeDaysAgo, now)).toBe('3 days ago')
    })

    it('should format future times', () => {
      const inTwoHours = now + 2 * DURATION.HOUR
      expect(formatRelativeTime(inTwoHours, now)).toBe('in 2 hours')
    })

    it('should handle singular forms', () => {
      const oneHourAgo = now - 1 * DURATION.HOUR
      expect(formatRelativeTime(oneHourAgo, now)).toBe('1 hour ago')
    })

    it('should handle just now', () => {
      const justNow = now - 30 * DURATION.SECOND
      expect(formatRelativeTime(justNow, now)).toBe('just now')
    })

    it('should handle in a moment', () => {
      const soon = now + 30 * DURATION.SECOND
      expect(formatRelativeTime(soon, now)).toBe('in a moment')
    })
  })
})
