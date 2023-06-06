import { timeAgo } from './utils'

describe('when using the timeAgo util', () => {
  describe.each(['2020-01-01', Number(new Date()), new Date()])(
    'and the input is valid',
    input => {
      it('returns a string', () => {
        expect(timeAgo(input)).toEqual(expect.any(String))
      })
    }
  )

  describe.each(['invalid input'])('and the input is invalid', input => {
    it('returns null', () => {
      expect(timeAgo(input)).toBeUndefined()
    })
  })

  describe('and the input represents a date from less than a second ago', () => {
    it('should return "now"', () => {
      expect(timeAgo(Date.now())).toBe('now')
    })
  })

  describe.each([
    ['1 second ago', 1001],
    ['2 seconds ago', 2000],
    ['1 minute ago', 1100 * 60],
    ['2 minutes ago', 2001 * 60],
    ['1 hour ago', 1001 * 3600],
    ['2 hours ago', 2001 * 3600],
    ['1 day ago', 1001 * 3600 * 24],
    ['2 days ago', 2001 * 3600 * 24],
    ['1 week ago', 1001 * 3600 * 24 * 7],
    ['2 weeks ago', 2001 * 3600 * 24 * 7],
    ['1 month ago', 1001 * 3600 * 24 * 30],
    ['2 months ago', 2001 * 3600 * 24 * 30],
    ['1 year ago', 1001 * 3600 * 24 * 365],
    ['2 years ago', 2001 * 3600 * 24 * 365]
  ])(
    'and the input represents a date from more than %s',
    (expectedRelativeTime, subtraction) => {
      it('should return the relative time', () => {
        expect(timeAgo(new Date(Date.now() - subtraction))).toBe(
          expectedRelativeTime
        )
      })
    }
  )
})
