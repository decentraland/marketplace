import { NFTCategory } from '@dcl/schemas'
import { NFT } from '../../../modules/nft/types'
import { showPriceBelowMarketValueWarning } from './utils'

describe('when showing a price confirmation modal', () => {
  let nft: NFT
  describe('and the NFT is not a land', () => {
    beforeAll(() => {
      nft = { category: NFTCategory.WEARABLE } as NFT
    })
    it('should NOT show a warning if the price is below threshold', () => {
      expect(showPriceBelowMarketValueWarning(nft, 1)).toBe(false)
    })
    it('should NOT show a warning if the price is above threshold', () => {
      expect(showPriceBelowMarketValueWarning(nft, 1000)).toBe(false)
    })
  })
  describe('and the NFT is a parcel', () => {
    beforeAll(() => {
      nft = { category: NFTCategory.PARCEL } as NFT
    })
    it('should show a warning if the price is below threshold', () => {
      expect(showPriceBelowMarketValueWarning(nft, 1)).toBe(true)
    })
    it('should NOT show a warning if the price is above threshold', () => {
      expect(showPriceBelowMarketValueWarning(nft, 1000)).toBe(false)
    })
  })
  describe('and the NFT is an estate', () => {
    beforeAll(() => {
      nft = { category: NFTCategory.ESTATE } as NFT
    })
    it('should show a warning if the price is below threshold', () => {
      expect(showPriceBelowMarketValueWarning(nft, 1)).toBe(true)
    })
    it('should NOT show a warning if the price is above threshold', () => {
      expect(showPriceBelowMarketValueWarning(nft, 1000)).toBe(false)
    })
  })
})
