import { TradeAssetType } from '@dcl/schemas'
import {
  USD_CENTS_PER_CREDIT,
  USD_WEI_PER_CREDIT,
  creditsToUsd,
  formatCredits,
  formatCreditsAsUsd,
  formatCreditsFull,
  isUSDPeggedTradeAsset,
  usdWeiToCredits
} from './credits'

const USD_1 = '1000000000000000000'

describe('lib/credits', () => {
  describe('the peg', () => {
    it('should keep 1 credit at 10 US cents, matching the shop app', () => {
      expect(USD_CENTS_PER_CREDIT).toBe(10)
    })

    it('should derive the USD wei per credit from the peg', () => {
      expect(USD_WEI_PER_CREDIT).toBe(100000000000000000n)
    })
  })

  describe('when checking whether a trade asset is USD-pegged', () => {
    it('should be true for USD_PEGGED_MANA', () => {
      expect(isUSDPeggedTradeAsset({ assetType: TradeAssetType.USD_PEGGED_MANA })).toBe(true)
    })

    it('should be false for a plain ERC20 (MANA) asset', () => {
      expect(isUSDPeggedTradeAsset({ assetType: TradeAssetType.ERC20 })).toBe(false)
    })

    it('should be false for a missing asset', () => {
      expect(isUSDPeggedTradeAsset(undefined)).toBe(false)
      expect(isUSDPeggedTradeAsset(null)).toBe(false)
    })
  })

  describe('when converting USD wei to credits', () => {
    it('should convert the production case of 0.6 USD to 6 credits', () => {
      // Item 0xb7e85d27bf1614201026f8f95e05f13c22ad147b itemId 0, trade
      // 095e3030-a7d0-4c70-9f9e-4c0e5ddb728d: received assetType 2, amount 600000000000000000.
      // The marketplace showed "0.6 ($0.04)"; the right answer is 6 credits / $0.60.
      expect(usdWeiToCredits('600000000000000000')).toBe(6)
    })

    it('should convert $1 to 10 credits', () => {
      expect(usdWeiToCredits(USD_1)).toBe(10)
    })

    it('should convert exact multiples of the peg without rounding', () => {
      expect(usdWeiToCredits('100000000000000000')).toBe(1)
      expect(usdWeiToCredits('1100000000000000000')).toBe(11)
      expect(usdWeiToCredits('500000000000000000')).toBe(5)
      expect(usdWeiToCredits('550000000000000000000')).toBe(5500)
    })

    it('should round UP so the shown price never sits below what checkout charges', () => {
      expect(usdWeiToCredits('100000000000000001')).toBe(2)
      expect(usdWeiToCredits('150000000000000000')).toBe(2)
      expect(usdWeiToCredits('199999999999999999')).toBe(2)
    })

    it('should floor at 1 credit for a tiny non-zero amount', () => {
      expect(usdWeiToCredits('1')).toBe(1)
      expect(usdWeiToCredits('99999999999999999')).toBe(1)
    })

    it('should floor at 1 credit for a zero amount', () => {
      expect(usdWeiToCredits('0')).toBe(1)
    })

    it('should stay exact for amounts beyond safe float range', () => {
      // 1e30 USD wei = 1e12 USD = 1e13 credits. A float conversion drifts here; BigInt does not.
      expect(usdWeiToCredits('1000000000000000000000000000000')).toBe(10000000000000)
    })

    it('should return null on a malformed amount', () => {
      expect(usdWeiToCredits('not-a-number')).toBeNull()
      expect(usdWeiToCredits('')).toBeNull()
      expect(usdWeiToCredits('1.5')).toBeNull()
    })

    it('should return null on a negative amount', () => {
      expect(usdWeiToCredits('-100000000000000000')).toBeNull()
    })
  })

  describe('when converting credits to USD', () => {
    it('should be exact', () => {
      expect(creditsToUsd(6)).toBe(0.6)
      expect(creditsToUsd(10)).toBe(1)
      expect(creditsToUsd(1)).toBe(0.1)
    })
  })

  describe('when formatting credits', () => {
    it('should render small amounts verbatim', () => {
      expect(formatCredits(6)).toBe('6')
      expect(formatCredits(500)).toBe('500')
    })

    it('should compact large amounts', () => {
      expect(formatCredits(12000)).toBe('12K')
      expect(formatCredits(5500000)).toBe('5.5M')
    })

    it('should group the full amount', () => {
      expect(formatCreditsFull(5500000)).toBe('5,500,000')
    })

    it('should render the dollar equivalent with two decimals', () => {
      expect(formatCreditsAsUsd(6)).toBe('$0.60')
      expect(formatCreditsAsUsd(10)).toBe('$1.00')
      expect(formatCreditsAsUsd(12000)).toBe('$1,200.00')
    })
  })
})
