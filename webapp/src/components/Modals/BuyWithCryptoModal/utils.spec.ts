import type { Token } from 'decentraland-transactions/crossChain'
import { formatPrice } from './utils'

let token: Token

describe('Utils', () => {
  describe('formatPrice with high value token', () => {
    beforeEach(() => {
      token = { usdPrice: 1000 } as Token
    })
    it('should render the right amount of decimals', () => {
      expect(formatPrice(1234.5678, token)).toBe(1234.5678)
      expect(formatPrice('1234.5678', token)).toBe(1234.5678)
      expect(formatPrice(1234.56789, token)).toBe(1234.5678)
      expect(formatPrice('1234.56789', token)).toBe(1234.5678)
      expect(formatPrice(0.0000001, token)).toBe(0.0000001) // show first relevant decimal even if it's too low
    })
  })

  describe('formatPrice with low value token', () => {
    beforeEach(() => {
      token = { usdPrice: 0.5 } as Token
    })
    it('should render the right amount of decimals', () => {
      expect(formatPrice(0.0001234, token)).toBe(0.00012)
      expect(formatPrice('0.0001234', token)).toBe(0.00012)
      expect(formatPrice(0.0001267, token)).toBe(0.00012)
      expect(formatPrice('0.0001267', token)).toBe(0.00012)
      expect(formatPrice(0.0000001, token)).toBe(0.0000001) // show first relevant decimal even if it's too low
    })
  })
})
