import { toFixedMANAValue } from './mana'

describe('when formatting the price', () => {
  describe('when formatting alphanumeric text', () => {
    it('should return the supplied value', () => {
      expect(toFixedMANAValue('abc')).toBe('abc')
    })
  })

  describe('when formatting an invalid number', () => {
    it('should return the supplied value', () => {
      expect(toFixedMANAValue('1.bc')).toBe('1.bc')
    })
  })

  describe('when formatting a valid integer number', () => {
    it('should return the supplied value', () => {
      expect(toFixedMANAValue('1')).toBe('1')
    })
  })

  describe('when formatting a valid float number', () => {
    describe('when the number has 2 or less decimal places', () => {
      it('should return the supplied value', () => {
        expect(toFixedMANAValue('51.3')).toBe('51.3')
      })
    })

    describe('when the number has more than 2 decimal places', () => {
      it('should fix the value to the first two decimal places', () => {
        expect(toFixedMANAValue('765.93023')).toBe('765.93')
      })
    })
  })
})
