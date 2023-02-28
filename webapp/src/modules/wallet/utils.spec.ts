import { formatBalance } from './utils'

describe('when formatting the balance', () => {
  describe('and the number is 0', () => {
    it('should return 0', () => {
      expect(formatBalance(0.0)).toBe('0')
    })
  })

  describe('and the number is too low', () => {
    it('should fixed the number based on the scientific notation', () => {
      expect(formatBalance(0.000000000000008588)).toBe('0.000000000000009')
    })
  })

  describe('and is near to the max amount of MANA', () => {
    it('should return the same number', () => {
      expect(formatBalance(229355146838009200000)).toBe('229355146838009200000')
    })
  })
})
