import { Rarity } from '@dcl/schemas'
import { WearableGender } from '../nft/wearable/types'
import { VendorName } from '../vendor'
import { locations } from './locations'
import { getSection, hasFiltersEnabled } from './selectors'
import { Sections } from './types'

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

describe('when getting the section', () => {
  describe("when there's no section URL param and the location is related to lands", () => {
    it("should return the decentraland's LAND section", () => {
      expect(
        getSection.resultFunc('', locations.lands(), VendorName.DECENTRALAND)
      ).toBe(Sections.decentraland.LAND)
    })
  })

  describe("when there's no section URL param and the vendor is Decentraland", () => {
    it("should return the decentraland's WEARABLES section", () => {
      expect(
        getSection.resultFunc('', locations.browse(), VendorName.DECENTRALAND)
      ).toBe(Sections.decentraland.WEARABLES)
    })
  })

  describe('when the section URL param is ALL and the vendor is Decentraland', () => {
    it("should return the decentraland's WEARABLES section", () => {
      expect(
        getSection.resultFunc(
          'section=ALL',
          locations.browse(),
          VendorName.DECENTRALAND
        )
      ).toBe(Sections.decentraland.WEARABLES)
    })
  })

  describe("when there's no section URL param and the vendor is not Decentraland", () => {
    it("should return the vendor's ALL section", () => {
      expect(
        getSection.resultFunc('', locations.browse(), VendorName.SUPER_RARE)
      ).toBe(Sections.super_rare.ALL)
    })
  })

  describe('when the section URL param does not exist in the vendor', () => {
    it("should return the vendor's ALL section", () => {
      expect(
        getSection.resultFunc(
          'section=NOT_EXISTENT',
          locations.browse(),
          VendorName.SUPER_RARE
        )
      ).toBe(Sections.super_rare.ALL)
    })
  })
})
