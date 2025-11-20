import { EmoteOutcomeType, EmotePlayMode, GenderFilterOption, Network, Rarity } from '@dcl/schemas'
import { AssetStatusFilter } from '../../utils/filters'
import { AssetType } from '../asset/types'
import { View } from '../ui/types'
import { Section } from '../vendor/decentraland/routing/types'
import { Sections } from '../vendor/routing/types'
import { VendorName } from '../vendor/types'
import { BrowseOptions, SortBy } from './types'
import * as urlParser from './url-parser'

describe('when getting the vendor from search parameters', () => {
  let search: string

  describe('and vendor parameter is valid', () => {
    beforeEach(() => {
      search = '?vendor=decentraland'
    })

    it('should return the vendor from search parameters', () => {
      const result = urlParser.getVendorFromSearchParameters(search)
      expect(result).toBe(VendorName.DECENTRALAND)
    })
  })

  describe('and vendor parameter is invalid', () => {
    beforeEach(() => {
      search = '?vendor=invalid'
    })

    it('should return default vendor', () => {
      const result = urlParser.getVendorFromSearchParameters(search)
      expect(result).toBe(VendorName.DECENTRALAND)
    })
  })

  describe('and no vendor parameter is provided', () => {
    beforeEach(() => {
      search = ''
    })

    it('should return default vendor', () => {
      const result = urlParser.getVendorFromSearchParameters(search)
      expect(result).toBe(VendorName.DECENTRALAND)
    })
  })
})

describe('when getting the section from URL', () => {
  let search: string
  let pathname: string

  describe('and no section parameter is provided', () => {
    beforeEach(() => {
      search = ''
    })

    describe('and pathname is lands', () => {
      beforeEach(() => {
        pathname = '/lands'
      })

      it('should return LAND section', () => {
        const result = urlParser.getSectionFromUrl(search, pathname)
        expect(result).toBe(Sections.decentraland.LAND)
      })
    })

    describe('and pathname is names', () => {
      beforeEach(() => {
        pathname = '/names/browse'
      })

      it('should return ENS section', () => {
        const result = urlParser.getSectionFromUrl(search, pathname)
        expect(result).toBe(Sections.decentraland.ENS)
      })
    })

    describe('and pathname is browse with decentraland vendor', () => {
      beforeEach(() => {
        search = '?vendor=decentraland'
        pathname = '/browse'
      })

      it('should return WEARABLES section', () => {
        const result = urlParser.getSectionFromUrl(search, pathname)
        expect(result).toBe(Sections.decentraland.WEARABLES)
      })
    })
  })

  describe('and section parameter is valid', () => {
    beforeEach(() => {
      search = '?section=wearables'
      pathname = '/browse'
    })

    it('should return section from parameter', () => {
      const result = urlParser.getSectionFromUrl(search, pathname)
      expect(result).toBe('wearables')
    })
  })

  describe('and section parameter is invalid', () => {
    beforeEach(() => {
      search = '?section=invalid'
      pathname = '/browse'
    })

    it('should return ALL section', () => {
      const result = urlParser.getSectionFromUrl(search, pathname)
      expect(result).toBe(Sections.decentraland.ALL)
    })
  })
})

describe('when getting the page number from search parameters', () => {
  let search: string

  describe('and page parameter is a valid number', () => {
    beforeEach(() => {
      search = '?page=5'
    })

    it('should return page number', () => {
      const result = urlParser.getPageNumberFromSearchParameters(search)
      expect(result).toBe(5)
    })
  })

  describe('and page parameter is null', () => {
    beforeEach(() => {
      search = ''
    })

    it('should return 1', () => {
      const result = urlParser.getPageNumberFromSearchParameters(search)
      expect(result).toBe(1)
    })
  })

  describe('and page parameter is not a number', () => {
    beforeEach(() => {
      search = '?page=abc'
    })

    it('should return 1', () => {
      const result = urlParser.getPageNumberFromSearchParameters(search)
      expect(result).toBe(1)
    })
  })

  describe('and page parameter is negative', () => {
    beforeEach(() => {
      search = '?page=-1'
    })

    it('should return negative number', () => {
      const result = urlParser.getPageNumberFromSearchParameters(search)
      expect(result).toBe(-1)
    })
  })
})

describe('when getting the sortBy from search parameters', () => {
  let search: string
  let pathname: string

  describe('and sortBy parameter is provided', () => {
    beforeEach(() => {
      search = '?sortBy=cheapest'
      pathname = '/browse'
    })

    it('should return sortBy from search parameters', () => {
      const result = urlParser.getSortByFromSearchParameters(search, pathname)
      expect(result).toBe('cheapest')
    })
  })

  describe('and sortBy parameter is not provided', () => {
    beforeEach(() => {
      search = ''
      pathname = '/browse'
    })

    it('should return default sortBy', () => {
      const result = urlParser.getSortByFromSearchParameters(search, pathname)
      expect(result).toBe(SortBy.RECENTLY_LISTED)
    })
  })
})

describe('when getting the onlyOnSale from search parameters', () => {
  let search: string
  let pathname: string

  describe('and onlyOnSale parameter is "true"', () => {
    beforeEach(() => {
      search = '?onlyOnSale=true'
      pathname = '/browse'
    })

    it('should return true', () => {
      const result = urlParser.getOnlyOnSaleFromSearchParameters(search, pathname)
      expect(result).toBe(true)
    })
  })

  describe('and onlyOnSale parameter is "false"', () => {
    beforeEach(() => {
      search = '?onlyOnSale=false'
      pathname = '/browse'
    })

    it('should return false', () => {
      const result = urlParser.getOnlyOnSaleFromSearchParameters(search, pathname)
      expect(result).toBe(false)
    })
  })

  describe('and parameter is not provided for non-land sections', () => {
    beforeEach(() => {
      search = '?section=wearables'
      pathname = '/browse'
    })

    it('should return default value', () => {
      const result = urlParser.getOnlyOnSaleFromSearchParameters(search, pathname)
      expect(result).toBe(undefined)
    })
  })

  describe('and parameter is not provided for land sections', () => {
    beforeEach(() => {
      search = '?section=land'
      pathname = '/browse'
    })

    it('should return undefined', () => {
      const result = urlParser.getOnlyOnSaleFromSearchParameters(search, pathname)
      expect(result).toBe(undefined)
    })
  })
})

describe('when getting the onlyOnRent from search parameters', () => {
  let search: string

  describe('and onlyOnRent parameter is "true"', () => {
    beforeEach(() => {
      search = '?onlyOnRent=true'
    })

    it('should return true', () => {
      const result = urlParser.getOnlyOnRentFromSearchParameters(search)
      expect(result).toBe(true)
    })
  })

  describe('and onlyOnRent parameter is "false"', () => {
    beforeEach(() => {
      search = '?onlyOnRent=false'
    })

    it('should return false', () => {
      const result = urlParser.getOnlyOnRentFromSearchParameters(search)
      expect(result).toBe(false)
    })
  })

  describe('and onlyOnRent parameter is not provided', () => {
    beforeEach(() => {
      search = ''
    })

    it('should return undefined', () => {
      const result = urlParser.getOnlyOnRentFromSearchParameters(search)
      expect(result).toBe(undefined)
    })
  })
})

describe('when getting the status from search parameters', () => {
  let search: string

  describe('and status parameter is provided', () => {
    beforeEach(() => {
      search = '?status=on_sale'
    })

    it('should return status from search parameters', () => {
      const result = urlParser.getStatusFromSearchParameters(search)
      expect(result).toBe(AssetStatusFilter.ON_SALE)
    })
  })

  describe('and no status parameter is provided', () => {
    beforeEach(() => {
      search = ''
    })

    it('should return undefined', () => {
      const result = urlParser.getStatusFromSearchParameters(search)
      expect(result).toBe(undefined)
    })
  })
})

describe('when getting the emote play mode from search parameters', () => {
  let search: string

  describe('and emotePlayMode parameters are provided', () => {
    beforeEach(() => {
      search = '?emotePlayMode=simple&emotePlayMode=loop'
    })

    it('should return emote play modes from search parameters', () => {
      const result = urlParser.getEmotePlayModeFromSearchParameters(search)
      expect(result).toEqual([EmotePlayMode.SIMPLE, EmotePlayMode.LOOP])
    })
  })

  describe('and no emotePlayMode parameter is provided', () => {
    beforeEach(() => {
      search = ''
    })

    it('should return empty array', () => {
      const result = urlParser.getEmotePlayModeFromSearchParameters(search)
      expect(result).toEqual([])
    })
  })
})

describe('when getting the viewAsGuest from search parameters', () => {
  let search: string

  describe('and viewAsGuest parameter is "true"', () => {
    beforeEach(() => {
      search = '?viewAsGuest=true'
    })

    it('should return true', () => {
      const result = urlParser.getViewAsGuestFromSearchParameters(search)
      expect(result).toBe(true)
    })
  })

  describe('and viewAsGuest parameter is "false"', () => {
    beforeEach(() => {
      search = '?viewAsGuest=false'
    })

    it('should return false', () => {
      const result = urlParser.getViewAsGuestFromSearchParameters(search)
      expect(result).toBe(false)
    })
  })

  describe('and viewAsGuest parameter is not provided', () => {
    beforeEach(() => {
      search = ''
    })

    it('should return undefined', () => {
      const result = urlParser.getViewAsGuestFromSearchParameters(search)
      expect(result).toBe(undefined)
    })
  })
})

describe('when getting the onlySmart from search parameters', () => {
  let search: string

  describe('and onlySmart parameter is "true"', () => {
    beforeEach(() => {
      search = '?onlySmart=true'
    })

    it('should return true', () => {
      const result = urlParser.getOnlySmartFromSearchParameters(search)
      expect(result).toBe(true)
    })
  })

  describe('and onlySmart parameter is "false"', () => {
    beforeEach(() => {
      search = '?onlySmart=false'
    })

    it('should return false', () => {
      const result = urlParser.getOnlySmartFromSearchParameters(search)
      expect(result).toBe(false)
    })
  })

  describe('and onlySmart parameter is not provided', () => {
    beforeEach(() => {
      search = ''
    })

    it('should return undefined', () => {
      const result = urlParser.getOnlySmartFromSearchParameters(search)
      expect(result).toBe(undefined)
    })
  })
})

describe('when getting string parameters from search', () => {
  let search: string

  describe('when getting the minPrice from search parameters', () => {
    describe('and minPrice parameter is provided', () => {
      beforeEach(() => {
        search = '?minPrice=100'
      })

      it('should return minPrice from search parameters', () => {
        const result = urlParser.getMinPriceFromSearchParameters(search)
        expect(result).toBe('100')
      })
    })

    describe('and minPrice parameter is not provided', () => {
      beforeEach(() => {
        search = ''
      })

      it('should return empty string', () => {
        const result = urlParser.getMinPriceFromSearchParameters(search)
        expect(result).toBe('')
      })
    })
  })

  describe('when getting the maxPrice from search parameters', () => {
    describe('and maxPrice parameter is provided', () => {
      beforeEach(() => {
        search = '?maxPrice=500'
      })

      it('should return maxPrice from search parameters', () => {
        const result = urlParser.getMaxPriceFromSearchParameters(search)
        expect(result).toBe('500')
      })
    })

    describe('and maxPrice parameter is not provided', () => {
      beforeEach(() => {
        search = ''
      })

      it('should return empty string', () => {
        const result = urlParser.getMaxPriceFromSearchParameters(search)
        expect(result).toBe('')
      })
    })
  })

  describe('when getting the minEstateSize from search parameters', () => {
    describe('and minEstateSize parameter is provided', () => {
      beforeEach(() => {
        search = '?minEstateSize=5'
      })

      it('should return minEstateSize from search parameters', () => {
        const result = urlParser.getMinEstateSizeFromSearchParameters(search)
        expect(result).toBe('5')
      })
    })

    describe('and minEstateSize parameter is not provided', () => {
      beforeEach(() => {
        search = ''
      })

      it('should return empty string', () => {
        const result = urlParser.getMinEstateSizeFromSearchParameters(search)
        expect(result).toBe('')
      })
    })
  })

  describe('when getting the maxEstateSize from search parameters', () => {
    describe('and maxEstateSize parameter is provided', () => {
      beforeEach(() => {
        search = '?maxEstateSize=20'
      })

      it('should return maxEstateSize from search parameters', () => {
        const result = urlParser.getMaxEstateSizeFromSearchParameters(search)
        expect(result).toBe('20')
      })
    })

    describe('and maxEstateSize parameter is not provided', () => {
      beforeEach(() => {
        search = ''
      })

      it('should return empty string', () => {
        const result = urlParser.getMaxEstateSizeFromSearchParameters(search)
        expect(result).toBe('')
      })
    })
  })

  describe('when getting the minDistanceToPlaza from search parameters', () => {
    describe('and minDistanceToPlaza parameter is provided', () => {
      beforeEach(() => {
        search = '?minDistanceToPlaza=1'
      })

      it('should return minDistanceToPlaza from search parameters', () => {
        const result = urlParser.getMinDistanceToPlazaFromSearchParameters(search)
        expect(result).toBe('1')
      })
    })

    describe('and minDistanceToPlaza parameter is not provided', () => {
      beforeEach(() => {
        search = ''
      })

      it('should return empty string', () => {
        const result = urlParser.getMinDistanceToPlazaFromSearchParameters(search)
        expect(result).toBe('')
      })
    })
  })

  describe('when getting the maxDistanceToPlaza from search parameters', () => {
    describe('and maxDistanceToPlaza parameter is provided', () => {
      beforeEach(() => {
        search = '?maxDistanceToPlaza=5'
      })

      it('should return maxDistanceToPlaza from search parameters', () => {
        const result = urlParser.getMaxDistanceToPlazaFromSearchParameters(search)
        expect(result).toBe('5')
      })
    })

    describe('and maxDistanceToPlaza parameter is not provided', () => {
      beforeEach(() => {
        search = ''
      })

      it('should return empty string', () => {
        const result = urlParser.getMaxDistanceToPlazaFromSearchParameters(search)
        expect(result).toBe('')
      })
    })
  })

  describe('when getting the itemId from search parameters', () => {
    describe('and itemId parameter is provided', () => {
      beforeEach(() => {
        search = '?itemId=123'
      })

      it('should return itemId from search parameters', () => {
        const result = urlParser.getItemIdFromSearchParameters(search)
        expect(result).toBe('123')
      })
    })

    describe('and itemId parameter is not provided', () => {
      beforeEach(() => {
        search = ''
      })

      it('should return undefined', () => {
        const result = urlParser.getItemIdFromSearchParameters(search)
        expect(result).toBe(undefined)
      })
    })
  })

  describe('when getting the search from search parameters', () => {
    describe('and search parameter is provided', () => {
      beforeEach(() => {
        search = '?search=dragon'
      })

      it('should return search from search parameters', () => {
        const result = urlParser.getSearchFromSearchParameters(search)
        expect(result).toBe('dragon')
      })
    })

    describe('and search parameter is not provided', () => {
      beforeEach(() => {
        search = ''
      })

      it('should return empty string', () => {
        const result = urlParser.getSearchFromSearchParameters(search)
        expect(result).toBe('')
      })
    })
  })
})

describe('when getting boolean parameters from search', () => {
  let search: string

  describe('when getting the adjacentToRoad from search parameters', () => {
    describe('and adjacentToRoad parameter is "true"', () => {
      beforeEach(() => {
        search = '?adjacentToRoad=true'
      })

      it('should return true', () => {
        const result = urlParser.getAdjacentToRoadFromSearchParameters(search)
        expect(result).toBe(true)
      })
    })

    describe('and adjacentToRoad parameter is not "true"', () => {
      beforeEach(() => {
        search = '?adjacentToRoad=false'
      })

      it('should return false', () => {
        const result = urlParser.getAdjacentToRoadFromSearchParameters(search)
        expect(result).toBe(false)
      })
    })

    describe('and adjacentToRoad parameter is not provided', () => {
      beforeEach(() => {
        search = ''
      })

      it('should return false', () => {
        const result = urlParser.getAdjacentToRoadFromSearchParameters(search)
        expect(result).toBe(false)
      })
    })
  })

  describe('when getting the emoteHasSound from search parameters', () => {
    describe('and emoteHasSound parameter is "true"', () => {
      beforeEach(() => {
        search = '?emoteHasSound=true'
      })

      it('should return true', () => {
        const result = urlParser.getEmoteHasSoundFromSearchParameters(search)
        expect(result).toBe(true)
      })
    })

    describe('and emoteHasSound parameter is not "true"', () => {
      beforeEach(() => {
        search = '?emoteHasSound=false'
      })

      it('should return false', () => {
        const result = urlParser.getEmoteHasSoundFromSearchParameters(search)
        expect(result).toBe(false)
      })
    })
  })

  describe('when getting the emoteHasGeometry from search parameters', () => {
    describe('and emoteHasGeometry parameter is "true"', () => {
      beforeEach(() => {
        search = '?emoteHasGeometry=true'
      })

      it('should return true', () => {
        const result = urlParser.getEmoteHasGeometryFromSearchParameters(search)
        expect(result).toBe(true)
      })
    })

    describe('and emoteHasGeometry parameter is not "true"', () => {
      beforeEach(() => {
        search = '?emoteHasGeometry=false'
      })

      it('should return false', () => {
        const result = urlParser.getEmoteHasGeometryFromSearchParameters(search)
        expect(result).toBe(false)
      })
    })
  })

  describe('when getting the withCredits from search parameters', () => {
    describe('and withCredits parameter is "true"', () => {
      beforeEach(() => {
        search = '?withCredits=true'
      })

      it('should return true', () => {
        const result = urlParser.getWithCreditsFromSearchParameters(search)
        expect(result).toBe(true)
      })
    })

    describe('and withCredits parameter is "false"', () => {
      beforeEach(() => {
        search = '?withCredits=false'
      })

      it('should return false', () => {
        const result = urlParser.getWithCreditsFromSearchParameters(search)
        expect(result).toBe(false)
      })
    })

    describe('and withCredits parameter is not provided', () => {
      beforeEach(() => {
        search = ''
      })

      it('should return undefined', () => {
        const result = urlParser.getWithCreditsFromSearchParameters(search)
        expect(result).toBe(undefined)
      })
    })
  })

  describe('when getting the isSoldOut from search parameters', () => {
    describe('and isSoldOut parameter is "true"', () => {
      beforeEach(() => {
        search = '?isSoldOut=true'
      })

      it('should return true', () => {
        const result = urlParser.getIsSoldOutFromSearchParameters(search)
        expect(result).toBe(true)
      })
    })

    describe('and isSoldOut parameter is not "true"', () => {
      beforeEach(() => {
        search = '?isSoldOut=false'
      })

      it('should return false', () => {
        const result = urlParser.getIsSoldOutFromSearchParameters(search)
        expect(result).toBe(false)
      })
    })
  })

  describe('when getting the isMap from search parameters', () => {
    describe('and isMap parameter is "true"', () => {
      beforeEach(() => {
        search = '?isMap=true'
      })

      it('should return true', () => {
        const result = urlParser.getIsMapFromSearchParameters(search)
        expect(result).toBe(true)
      })
    })

    describe('and isMap parameter is "false"', () => {
      beforeEach(() => {
        search = '?isMap=false'
      })

      it('should return false', () => {
        const result = urlParser.getIsMapFromSearchParameters(search)
        expect(result).toBe(false)
      })
    })

    describe('and isMap parameter is not provided', () => {
      beforeEach(() => {
        search = ''
      })

      it('should return undefined', () => {
        const result = urlParser.getIsMapFromSearchParameters(search)
        expect(result).toBe(undefined)
      })
    })
  })

  describe('when getting the withCard from search parameters', () => {
    describe('and withCard parameter is "true"', () => {
      beforeEach(() => {
        search = '?withCard=true'
      })

      it('should return true', () => {
        const result = urlParser.getWithCardFromSearchParameters(search)
        expect(result).toBe(true)
      })
    })

    describe('and withCard parameter is not "true" or is null', () => {
      beforeEach(() => {
        search = '?withCard=false'
      })

      it('should return false', () => {
        const result = urlParser.getWithCardFromSearchParameters(search)
        expect(result).toBe(false)
      })
    })

    describe('and withCard parameter is not provided', () => {
      beforeEach(() => {
        search = ''
      })

      it('should return false', () => {
        const result = urlParser.getWithCardFromSearchParameters(search)
        expect(result).toBe(false)
      })
    })
  })

  describe('when getting the isFullscreen from search parameters', () => {
    let isMap: boolean | undefined

    describe('and isFullscreen parameter is "true" and isMap is true', () => {
      beforeEach(() => {
        search = '?isFullscreen=true'
        isMap = true
      })

      it('should return true', () => {
        const result = urlParser.getIsFullscreenFromSearchParameters(search, isMap)
        expect(result).toBe(true)
      })
    })

    describe('and isFullscreen parameter is "true" but isMap is false', () => {
      beforeEach(() => {
        search = '?isFullscreen=true'
        isMap = false
      })

      it('should return false', () => {
        const result = urlParser.getIsFullscreenFromSearchParameters(search, isMap)
        expect(result).toBe(false)
      })
    })

    describe('and isFullscreen parameter is not provided', () => {
      beforeEach(() => {
        search = ''
        isMap = undefined
      })

      it('should return undefined', () => {
        const result = urlParser.getIsFullscreenFromSearchParameters(search, isMap)
        expect(result).toBe(undefined)
      })
    })
  })
})

describe('when getting array parameters from search', () => {
  let search: string

  describe('when getting the rental days from search parameters', () => {
    describe('and rentalDays parameters are provided', () => {
      beforeEach(() => {
        search = '?rentalDays=7&rentalDays=30&rentalDays=90'
      })

      it('should return rental days as numbers', () => {
        const result = urlParser.getRentalDaysFromSearchParameters(search)
        expect(result).toEqual([7, 30, 90])
      })
    })

    describe('and no rentalDays parameter is provided', () => {
      beforeEach(() => {
        search = ''
      })

      it('should return empty array', () => {
        const result = urlParser.getRentalDaysFromSearchParameters(search)
        expect(result).toEqual([])
      })
    })
  })

  describe('when getting the rarities from search parameters', () => {
    describe('and rarities parameter is provided', () => {
      beforeEach(() => {
        search = '?rarities=common_uncommon'
      })

      it('should return rarities from search parameters', () => {
        const result = urlParser.getRaritiesFromSearchParameters(search)
        expect(result).toEqual([Rarity.COMMON, Rarity.UNCOMMON])
      })
    })

    describe('and no rarities parameter is provided', () => {
      beforeEach(() => {
        search = ''
      })

      it('should return empty array', () => {
        const result = urlParser.getRaritiesFromSearchParameters(search)
        expect(result).toEqual([])
      })
    })
  })

  describe('when getting the wearable genders from search parameters', () => {
    describe('and genders parameter is provided', () => {
      beforeEach(() => {
        search = '?genders=male_female'
      })

      it('should return wearable genders from search parameters', () => {
        const result = urlParser.getWearableGendersFromSearchParameters(search)
        expect(result).toEqual([GenderFilterOption.MALE, GenderFilterOption.FEMALE])
      })
    })

    describe('and no genders parameter is provided', () => {
      beforeEach(() => {
        search = ''
      })

      it('should return empty array', () => {
        const result = urlParser.getWearableGendersFromSearchParameters(search)
        expect(result).toEqual([])
      })
    })
  })

  describe('when getting the contracts from search parameters', () => {
    describe('and contracts parameter is provided', () => {
      beforeEach(() => {
        search = '?contracts=0x123_0x456_0x789'
      })

      it('should return contracts array', () => {
        const result = urlParser.getContractsFromSearchParameters(search)
        expect(result).toEqual(['0x123', '0x456', '0x789'])
      })
    })

    describe('and no contracts parameter is provided', () => {
      beforeEach(() => {
        search = ''
      })

      it('should return empty array', () => {
        const result = urlParser.getContractsFromSearchParameters(search)
        expect(result).toEqual([])
      })
    })
  })

  describe('when getting the creators from search parameters', () => {
    describe('and creators parameters are provided', () => {
      beforeEach(() => {
        search = '?creators=creator1&creators=creator2'
      })

      it('should return creators array', () => {
        const result = urlParser.getCreatorsFromSearchParameters(search)
        expect(result).toEqual(['creator1', 'creator2'])
      })
    })

    describe('and no creators parameter is provided', () => {
      beforeEach(() => {
        search = ''
      })

      it('should return empty array', () => {
        const result = urlParser.getCreatorsFromSearchParameters(search)
        expect(result).toEqual([])
      })
    })
  })
})

describe('when getting the network from search parameters', () => {
  let search: string

  describe('and network parameter is valid', () => {
    beforeEach(() => {
      search = '?network=ethereum'
    })

    it('should return network from search parameters', () => {
      const result = urlParser.getNetworkFromSearchParameters(search)
      expect(result).toBe('ethereum')
    })
  })

  describe('and network parameter is not provided', () => {
    beforeEach(() => {
      search = ''
    })

    it('should return undefined', () => {
      const result = urlParser.getNetworkFromSearchParameters(search)
      expect(result).toBe(undefined)
    })
  })
})

describe('when getting the asset type from URL', () => {
  let search: string
  let pathname: string

  describe('and assetType parameter is valid', () => {
    beforeEach(() => {
      search = '?assetType=nft'
      pathname = '/browse'
    })

    it('should return asset type from search parameters', () => {
      const result = urlParser.getAssetTypeFromUrl(search, pathname)
      expect(result).toBe(AssetType.NFT)
    })
  })

  describe('and no assetType parameter is provided', () => {
    describe('and vendor is decentraland on browse path', () => {
      beforeEach(() => {
        search = '?vendor=decentraland'
        pathname = '/browse'
      })

      it('should return ITEM', () => {
        const result = urlParser.getAssetTypeFromUrl(search, pathname)
        expect(result).toBe(AssetType.ITEM)
      })
    })

    describe('and not on browse path', () => {
      beforeEach(() => {
        search = ''
        pathname = '/other'
      })

      it('should return NFT', () => {
        const result = urlParser.getAssetTypeFromUrl(search, pathname)
        expect(result).toBe(AssetType.NFT)
      })
    })

    describe('and assetType parameter is invalid but on browse path with decentraland vendor', () => {
      beforeEach(() => {
        search = '?assetType=invalid&vendor=decentraland'
        pathname = '/browse'
      })

      it('should return ITEM', () => {
        const result = urlParser.getAssetTypeFromUrl(search, pathname)
        expect(result).toBe(AssetType.ITEM)
      })
    })
  })
})

describe('when getting compound URL parameters', () => {
  let search: string

  describe('when getting emote-related URL parameters', () => {
    beforeEach(() => {
      search = '?emotePlayMode=simple&emoteHasSound=true&emoteHasGeometry=false&emoteOutcomeType=so'
    })

    it('should return emote-related URL parameters', () => {
      const result = urlParser.getEmoteUrlParamsFromSearchParameters(search)
      expect(result).toEqual({
        emotePlayMode: [EmotePlayMode.SIMPLE],
        emoteHasGeometry: false,
        emoteHasSound: true,
        emoteOutcomeType: EmoteOutcomeType.SIMPLE_OUTCOME
      })
    })
  })

  describe('when getting pagination-related URL parameters', () => {
    let pathname: string

    beforeEach(() => {
      search = '?page=2&sortBy=cheapest&search=dragon'
      pathname = '/browse'
    })

    it('should return pagination-related URL parameters', () => {
      const result = urlParser.getPaginationParamsFromUrl(search, pathname)
      expect(result).toEqual({
        page: 2,
        sortBy: 'cheapest',
        search: 'dragon'
      })
    })
  })

  describe('when getting asset-related URL parameters', () => {
    let pathname: string

    beforeEach(() => {
      search = '?onlyOnSale=true&onlySmart=false&creators=creator1&withCredits=true'
      pathname = '/browse'
    })

    it('should return asset-related URL parameters', () => {
      const result = urlParser.getAssetUrlParamsFromUrl(search, pathname)
      expect(result).toEqual({
        onlyOnSale: true,
        onlySmart: false,
        isSoldOut: false,
        itemId: undefined,
        contracts: [],
        creators: ['creator1'],
        search: '',
        withCredits: true
      })
    })
  })

  describe('when getting lands-related URL parameters', () => {
    beforeEach(() => {
      search = '?isMap=true&isFullscreen=true&minEstateSize=10&rentalDays=7&rentalDays=30'
    })

    it('should return lands-related URL parameters', () => {
      const result = urlParser.getLandsUrlParamsFromSearchParameters(search)
      expect(result).toEqual({
        isMap: true,
        isFullscreen: true,
        minEstateSize: '10',
        maxEstateSize: '',
        minDistanceToPlaza: '',
        maxDistanceToPlaza: '',
        adjacentToRoad: false,
        rentalDays: [7, 30]
      })
    })
  })

  describe('when getting current browse options', () => {
    let pathname: string
    let view: View

    beforeEach(() => {
      search = '?vendor=decentraland&section=wearables&page=1'
      pathname = '/browse'
      view = View.MARKET
    })

    it('should return complete browse options from URL parameters', () => {
      const result = urlParser.getCurrentBrowseOptions(search, pathname, view)
      expect(result).toMatchObject({
        assetType: AssetType.ITEM,
        vendor: VendorName.DECENTRALAND,
        section: 'wearables',
        view: View.MARKET,
        address: undefined
      })
    })
  })
})

describe('when checking if filters are enabled', () => {
  let browseOptions: BrowseOptions

  describe('and section is lists', () => {
    beforeEach(() => {
      browseOptions = { section: Section.LISTS }
    })

    it('should return false', () => {
      const result = urlParser.hasFiltersEnabled(browseOptions)
      expect(result).toBe(false)
    })
  })

  describe('and section is land', () => {
    describe('and has price filters', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.LAND,
          minPrice: '100'
        }
      })

      it('should return true', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(true)
      })
    })

    describe('and has estate size filters', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.LAND,
          minEstateSize: '5'
        }
      })

      it('should return true', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(true)
      })
    })

    describe('and has distance filters', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.LAND,
          minDistanceToPlaza: '1'
        }
      })

      it('should return true', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(true)
      })
    })

    describe('and has adjacentToRoad filter', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.LAND,
          adjacentToRoad: true
        }
      })

      it('should return true', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(true)
      })
    })

    describe('and has rental days filter', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.LAND,
          rentalDays: [7, 30]
        }
      })

      it('should return true', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(true)
      })
    })

    describe('and has exclusive sale/rent filters', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.LAND,
          onlyOnSale: true,
          onlyOnRent: false
        }
      })

      it('should return true', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(true)
      })
    })

    describe('and has both sale and rent filters true', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.LAND,
          onlyOnSale: true,
          onlyOnRent: true
        }
      })

      it('should return false', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(false)
      })
    })
  })

  describe('and section is not land', () => {
    describe('and has network filter', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.WEARABLES,
          network: Network.ETHEREUM
        }
      })

      it('should return true', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(true)
      })
    })

    describe('and has gender filter', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.WEARABLES,
          wearableGenders: [GenderFilterOption.MALE]
        }
      })

      it('should return true', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(true)
      })
    })

    describe('and has rarity filter', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.WEARABLES,
          rarities: [Rarity.COMMON]
        }
      })

      it('should return true', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(true)
      })
    })

    describe('and has contracts filter', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.WEARABLES,
          contracts: ['0x123']
        }
      })

      it('should return true', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(true)
      })
    })

    describe('and has creators filter', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.WEARABLES,
          creators: ['creator1']
        }
      })

      it('should return true', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(true)
      })
    })

    describe('and has emote play mode filter', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.EMOTES,
          emotePlayMode: [EmotePlayMode.SIMPLE]
        }
      })

      it('should return true', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(true)
      })
    })

    describe('and has onlySmart filter', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.WEARABLES,
          onlySmart: true
        }
      })

      it('should return true', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(true)
      })
    })

    describe('and has price filters', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.WEARABLES,
          minPrice: '10'
        }
      })

      it('should return true', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(true)
      })
    })

    describe('and has onlyOnSale false filter', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.WEARABLES,
          onlyOnSale: false
        }
      })

      it('should return true', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(true)
      })
    })

    describe('and has emote filters', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.EMOTES,
          emoteHasSound: true
        }
      })

      it('should return true', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(true)
      })
    })

    describe('and has status filter other than ON_SALE', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.WEARABLES,
          status: AssetStatusFilter.NOT_FOR_SALE
        }
      })

      it('should return true', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(true)
      })
    })

    describe('and has status ON_SALE', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.WEARABLES,
          status: AssetStatusFilter.ON_SALE
        }
      })

      it('should return false', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(false)
      })
    })

    describe('and has no filters', () => {
      beforeEach(() => {
        browseOptions = {
          section: Section.WEARABLES
        }
      })

      it('should return false', () => {
        const result = urlParser.hasFiltersEnabled(browseOptions)
        expect(result).toBe(false)
      })
    })
  })
})

describe('when getting sort by options from URL', () => {
  let search: string
  let pathname: string

  describe('and status is ON_SALE', () => {
    beforeEach(() => {
      search = '?status=on_sale'
      pathname = '/browse'
    })

    it('should return base filters', () => {
      const result = urlParser.getSortByOptionsFromUrl(search, pathname)
      expect(result.length).toBeGreaterThan(0)
      expect(result.some(option => option.value === SortBy.NEWEST)).toBe(true)
      expect(result.some(option => option.value === SortBy.CHEAPEST)).toBe(true)
    })
  })

  describe('and status is NOT_FOR_SALE', () => {
    beforeEach(() => {
      search = '?status=not_for_sale'
      pathname = '/browse'
    })

    it('should return only newest filter', () => {
      const result = urlParser.getSortByOptionsFromUrl(search, pathname)
      expect(result).toEqual([expect.objectContaining({ value: SortBy.NEWEST })])
    })
  })

  describe('and onlyOnRent is true', () => {
    beforeEach(() => {
      search = '?onlyOnRent=true'
      pathname = '/browse'
    })

    it('should return rental options', () => {
      const result = urlParser.getSortByOptionsFromUrl(search, pathname)
      expect(result.some(option => option.value === SortBy.RENTAL_LISTING_DATE)).toBe(true)
      expect(result.some(option => option.value === SortBy.NAME)).toBe(true)
      expect(result.some(option => option.value === SortBy.NEWEST)).toBe(true)
      expect(result.some(option => option.value === SortBy.MAX_RENTAL_PRICE)).toBe(true)
    })
  })

  describe('and no special filters are applied', () => {
    beforeEach(() => {
      search = ''
      pathname = '/browse'
    })

    it('should return basic options', () => {
      const result = urlParser.getSortByOptionsFromUrl(search, pathname)
      expect(result.some(option => option.value === SortBy.NEWEST)).toBe(true)
      expect(result.some(option => option.value === SortBy.NAME)).toBe(true)
    })
  })

  describe('and onlyOnSale is true', () => {
    beforeEach(() => {
      search = '?onlyOnSale=true'
      pathname = '/browse'
    })

    it('should add sale-specific options', () => {
      const result = urlParser.getSortByOptionsFromUrl(search, pathname)
      expect(result.some(option => option.value === SortBy.RECENTLY_LISTED)).toBe(true)
      expect(result.some(option => option.value === SortBy.RECENTLY_SOLD)).toBe(true)
      expect(result.some(option => option.value === SortBy.CHEAPEST)).toBe(true)
      expect(result.some(option => option.value === SortBy.NEWEST)).toBe(true)
      expect(result.some(option => option.value === SortBy.NAME)).toBe(true)
    })
  })
})

describe('when getting emote outcome type from search parameters', () => {
  let search: string

  describe('and emote outcome type parameter is provided', () => {
    beforeEach(() => {
      search = `?emoteOutcomeType=${EmoteOutcomeType.SIMPLE_OUTCOME}`
    })

    it('should return the emote outcome type', () => {
      expect(urlParser.getEmoteOutcomeFromSearchParameters(search)).toBe(EmoteOutcomeType.SIMPLE_OUTCOME)
    })
  })

  describe('and emote outcome type parameter is not provided', () => {
    beforeEach(() => {
      search = '?otherParam=value'
    })

    it('should return undefined', () => {
      expect(urlParser.getEmoteOutcomeFromSearchParameters(search)).toBeUndefined()
    })
  })
})
