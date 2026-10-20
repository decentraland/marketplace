import { formatWeiMANA } from './mana'

describe('when formatting a MANA amount in wei', () => {
  describe('and the amount is present', () => {
    it('should return it in ether', () => {
      expect(formatWeiMANA('1500000000000000000')).toBe('1.5')
    })
  })

  describe('and the amount is missing', () => {
    it('should return an empty string instead of throwing', () => {
      expect(formatWeiMANA(null)).toBe('')
      expect(formatWeiMANA(undefined)).toBe('')
      expect(formatWeiMANA('')).toBe('')
    })
  })
})
