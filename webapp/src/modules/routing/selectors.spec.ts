import { Rarity } from '@dcl/schemas'
import { WearableGender } from '../nft/wearable/types'
import { hasFiltersEnabled } from './selectors'

describe('when getting if the are filters set', () => {
  describe('when the network filter is set', () => {
    it('should return true', () => {
      expect(hasFiltersEnabled.resultFunc('aNetwork', [], [], [])).toBe(true)
    })
  })

  describe('when the genders filter is set', () => {
    it('should return true', () => {
      expect(
        hasFiltersEnabled.resultFunc(undefined, [WearableGender.FEMALE], [], [])
      ).toBe(true)
    })
  })

  describe('when the rarities filter is set', () => {
    it('should return true', () => {
      expect(
        hasFiltersEnabled.resultFunc(undefined, [], [Rarity.COMMON], [])
      ).toBe(true)
    })
  })

  describe('when the contracts filter is set', () => {
    it('should return true', () => {
      expect(hasFiltersEnabled.resultFunc(undefined, [], [], ['0x.....'])).toBe(
        true
      )
    })
  })

  describe('when the network, the genders, the rarities and the contracts filters is not set', () => {
    it('should return false', () => {
      expect(hasFiltersEnabled.resultFunc(undefined, [], [], [])).toBe(false)
    })
  })
})
