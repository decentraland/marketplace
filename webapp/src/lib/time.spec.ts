import { fromMillisecondsToSeconds } from './time'

describe('when converting from milliseconds to seconds', () => {
  describe('and the conversion to milliseconds ends up in a splitted second timestamp', () => {
    it('should return the timestamp ', () => {
      const time = 1656105118092
      expect(fromMillisecondsToSeconds(time)).toEqual(1656105118)
    })
  })

  describe('and the conversion to milliseconds ends up in a round second timestamp', () => {
    it('should return the timestamp ', () => {
      const time = 1656105118000
      expect(fromMillisecondsToSeconds(time)).toEqual(1656105118)
    })
  })
})
