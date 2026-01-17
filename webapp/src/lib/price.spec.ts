import { ethers } from 'ethers'
import {
  formatPrice,
  formatPriceCompact,
  calculatePriceChange,
  formatPriceChange,
  isPriceInRange,
  isValidPriceInput,
  etherToWei,
  weiToEther,
  calculateTotalPrice,
  comparePrices,
  getMinPrice,
  getMaxPrice,
  getAveragePrice
} from './price'

describe('Price utilities', () => {
  describe('formatPrice', () => {
    it('should format zero correctly', () => {
      expect(formatPrice('0')).toBe('0 MANA')
    })

    it('should format a simple price', () => {
      const wei = ethers.utils.parseEther('100').toString()
      expect(formatPrice(wei)).toBe('100 MANA')
    })

    it('should format with custom symbol', () => {
      const wei = ethers.utils.parseEther('50').toString()
      expect(formatPrice(wei, 'ETH')).toBe('50 ETH')
    })

    it('should respect maximum fraction digits', () => {
      const wei = ethers.utils.parseEther('100.123456').toString()
      expect(formatPrice(wei, 'MANA', 2)).toMatch(/100\.12.*MANA/)
    })
  })

  describe('formatPriceCompact', () => {
    it('should format zero correctly', () => {
      expect(formatPriceCompact('0')).toBe('0 MANA')
    })

    it('should format millions with M suffix', () => {
      const wei = ethers.utils.parseEther('1500000').toString()
      expect(formatPriceCompact(wei)).toBe('1.5M MANA')
    })

    it('should format thousands with K suffix', () => {
      const wei = ethers.utils.parseEther('25000').toString()
      expect(formatPriceCompact(wei)).toBe('25.0K MANA')
    })

    it('should format small values without suffix', () => {
      const wei = ethers.utils.parseEther('500').toString()
      expect(formatPriceCompact(wei)).toBe('500 MANA')
    })
  })

  describe('calculatePriceChange', () => {
    it('should calculate positive change', () => {
      const previous = ethers.utils.parseEther('100').toString()
      const current = ethers.utils.parseEther('150').toString()
      expect(calculatePriceChange(current, previous)).toBe(50)
    })

    it('should calculate negative change', () => {
      const previous = ethers.utils.parseEther('100').toString()
      const current = ethers.utils.parseEther('75').toString()
      expect(calculatePriceChange(current, previous)).toBe(-25)
    })

    it('should handle zero previous price', () => {
      const previous = '0'
      const current = ethers.utils.parseEther('100').toString()
      expect(calculatePriceChange(current, previous)).toBe(100)
    })

    it('should return 0 when both are zero', () => {
      expect(calculatePriceChange('0', '0')).toBe(0)
    })
  })

  describe('formatPriceChange', () => {
    it('should format positive change with + prefix', () => {
      expect(formatPriceChange(25.5)).toBe('+25.5%')
    })

    it('should format negative change', () => {
      expect(formatPriceChange(-10.2)).toBe('-10.2%')
    })

    it('should format zero as positive', () => {
      expect(formatPriceChange(0)).toBe('+0.0%')
    })
  })

  describe('isPriceInRange', () => {
    const price = ethers.utils.parseEther('100').toString()
    const min = ethers.utils.parseEther('50').toString()
    const max = ethers.utils.parseEther('150').toString()

    it('should return true when price is in range', () => {
      expect(isPriceInRange(price, min, max)).toBe(true)
    })

    it('should return false when price is below min', () => {
      const lowPrice = ethers.utils.parseEther('25').toString()
      expect(isPriceInRange(lowPrice, min, max)).toBe(false)
    })

    it('should return false when price is above max', () => {
      const highPrice = ethers.utils.parseEther('200').toString()
      expect(isPriceInRange(highPrice, min, max)).toBe(false)
    })

    it('should work with only min specified', () => {
      expect(isPriceInRange(price, min)).toBe(true)
    })

    it('should work with only max specified', () => {
      expect(isPriceInRange(price, undefined, max)).toBe(true)
    })
  })

  describe('isValidPriceInput', () => {
    it('should return true for valid positive numbers', () => {
      expect(isValidPriceInput('100')).toBe(true)
      expect(isValidPriceInput('0.5')).toBe(true)
      expect(isValidPriceInput('1000000')).toBe(true)
    })

    it('should return false for empty strings', () => {
      expect(isValidPriceInput('')).toBe(false)
      expect(isValidPriceInput('   ')).toBe(false)
    })

    it('should return false for zero or negative', () => {
      expect(isValidPriceInput('0')).toBe(false)
      expect(isValidPriceInput('-10')).toBe(false)
    })

    it('should return false for non-numeric strings', () => {
      expect(isValidPriceInput('abc')).toBe(false)
      expect(isValidPriceInput('12abc')).toBe(false)
    })
  })

  describe('etherToWei', () => {
    it('should convert ether string to wei', () => {
      expect(etherToWei('1')).toBe('1000000000000000000')
    })

    it('should convert ether number to wei', () => {
      expect(etherToWei(2.5)).toBe('2500000000000000000')
    })
  })

  describe('weiToEther', () => {
    it('should convert wei to ether number', () => {
      expect(weiToEther('1000000000000000000')).toBe(1)
    })

    it('should handle fractional values', () => {
      expect(weiToEther('1500000000000000000')).toBe(1.5)
    })
  })

  describe('calculateTotalPrice', () => {
    it('should multiply price by quantity', () => {
      const price = ethers.utils.parseEther('10').toString()
      const total = calculateTotalPrice(price, 5)
      expect(total).toBe(ethers.utils.parseEther('50').toString())
    })

    it('should return 0 for zero quantity', () => {
      const price = ethers.utils.parseEther('10').toString()
      expect(calculateTotalPrice(price, 0)).toBe('0')
    })

    it('should return 0 for negative quantity', () => {
      const price = ethers.utils.parseEther('10').toString()
      expect(calculateTotalPrice(price, -1)).toBe('0')
    })
  })

  describe('comparePrices', () => {
    it('should return -1 when A < B', () => {
      const a = ethers.utils.parseEther('10').toString()
      const b = ethers.utils.parseEther('20').toString()
      expect(comparePrices(a, b)).toBe(-1)
    })

    it('should return 1 when A > B', () => {
      const a = ethers.utils.parseEther('30').toString()
      const b = ethers.utils.parseEther('20').toString()
      expect(comparePrices(a, b)).toBe(1)
    })

    it('should return 0 when A === B', () => {
      const a = ethers.utils.parseEther('20').toString()
      const b = ethers.utils.parseEther('20').toString()
      expect(comparePrices(a, b)).toBe(0)
    })
  })

  describe('getMinPrice', () => {
    it('should return the minimum price', () => {
      const prices = [
        ethers.utils.parseEther('100').toString(),
        ethers.utils.parseEther('50').toString(),
        ethers.utils.parseEther('75').toString()
      ]
      expect(getMinPrice(prices)).toBe(ethers.utils.parseEther('50').toString())
    })

    it('should return null for empty array', () => {
      expect(getMinPrice([])).toBe(null)
    })
  })

  describe('getMaxPrice', () => {
    it('should return the maximum price', () => {
      const prices = [
        ethers.utils.parseEther('100').toString(),
        ethers.utils.parseEther('50').toString(),
        ethers.utils.parseEther('75').toString()
      ]
      expect(getMaxPrice(prices)).toBe(ethers.utils.parseEther('100').toString())
    })

    it('should return null for empty array', () => {
      expect(getMaxPrice([])).toBe(null)
    })
  })

  describe('getAveragePrice', () => {
    it('should calculate the average price', () => {
      const prices = [
        ethers.utils.parseEther('100').toString(),
        ethers.utils.parseEther('200').toString(),
        ethers.utils.parseEther('300').toString()
      ]
      expect(getAveragePrice(prices)).toBe(ethers.utils.parseEther('200').toString())
    })

    it('should return 0 for empty array', () => {
      expect(getAveragePrice([])).toBe('0')
    })
  })
})
