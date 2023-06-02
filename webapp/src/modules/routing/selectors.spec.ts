import { RouterLocation } from 'connected-react-router'
import {
  EmotePlayMode,
  GenderFilterOption,
  Network,
  Rarity
} from '@dcl/schemas'
import { AssetStatusFilter } from '../../utils/filters'
import { AssetType } from '../asset/types'
import { VendorName } from '../vendor'
import { Section } from '../vendor/routing/types'
import { View } from '../ui/types'
import { PageName, Sections, SortBy } from './types'
import { locations } from './locations'
import {
  getAllSortByOptions,
  getAssetType,
  getCreators,
  getIsMap,
  getMaxEstateSize,
  getMaxPrice,
  getMinEstateSize,
  getMinPrice,
  getOnlyOnRent,
  getOnlySmart,
  getPageName,
  getSection,
  getSortBy,
  getViewAsGuest,
  getSortByOptions,
  getStatus,
  hasFiltersEnabled,
  getLatestVisitedLocation
} from './selectors'

describe('when getting the latest visited location', () => {
  describe('and there is no previous location', () => {
    it('should return undefined', () => {
      expect(getLatestVisitedLocation.resultFunc([])).toBe(undefined)
    })
  })

  describe('and there is a previous location', () => {
    let prevLocation: RouterLocation<unknown>
    beforeEach(() => {
      prevLocation = {
        pathname: '/browse'
      } as RouterLocation<unknown>
    })
    it('should return the location', () => {
      expect(
        getLatestVisitedLocation.resultFunc([
          { ...prevLocation, pathname: 'an oldest location' },
          prevLocation
        ])
      ).toBe(prevLocation)
    })
  })
})

describe('when getting if the are filters set', () => {
  describe('when the search filter is set', () => {
    it('should return false', () => {
      const expected = hasFiltersEnabled.resultFunc({
        search: 'a search'
      })
      expect(expected).toBe(false)
    })
  })

  describe('when the creator filter is set', () => {
    it('should return true', () => {
      expect(hasFiltersEnabled.resultFunc({ creators: ['anAddress'] })).toBe(
        true
      )
    })
  })

  describe('when the network filter is set', () => {
    it('should return true', () => {
      expect(
        hasFiltersEnabled.resultFunc({ network: 'aNetwork' as Network })
      ).toBe(true)
    })
  })

  describe('when the genders filter is set', () => {
    it('should return true', () => {
      expect(
        hasFiltersEnabled.resultFunc({
          wearableGenders: [GenderFilterOption.FEMALE]
        })
      ).toBe(true)
    })
  })

  describe('when the rarities filter is set', () => {
    it('should return true', () => {
      expect(hasFiltersEnabled.resultFunc({ rarities: [Rarity.COMMON] })).toBe(
        true
      )
    })
  })

  describe('when the contracts filter is set', () => {
    it('should return true', () => {
      expect(hasFiltersEnabled.resultFunc({ contracts: ['0x.....'] })).toBe(
        true
      )
    })
  })

  describe('when the playmode filter is set', () => {
    it('should return true', () => {
      expect(
        hasFiltersEnabled.resultFunc({ emotePlayMode: [EmotePlayMode.LOOP] })
      ).toBe(true)
    })
  })

  describe('when the minPrice filter is set', () => {
    it('should return true', () => {
      expect(hasFiltersEnabled.resultFunc({ minPrice: '10' })).toBe(true)
    })
  })

  describe('when the maxPrice filter is set', () => {
    it('should return true', () => {
      expect(hasFiltersEnabled.resultFunc({ maxPrice: '100' })).toBe(true)
    })
  })

  describe('and it is the land section', () => {
    describe('when the minEstateSize filter is set', () => {
      it('should return true', () => {
        expect(
          hasFiltersEnabled.resultFunc({
            section: Sections.decentraland.LAND,
            minEstateSize: '10'
          })
        ).toBe(true)
      })
    })

    describe('when the maxEstateSize filter is set', () => {
      it('should return true', () => {
        expect(
          hasFiltersEnabled.resultFunc({
            section: Sections.decentraland.LAND,
            maxEstateSize: '100'
          })
        ).toBe(true)
      })
    })
  })

  describe('and the status is set', () => {
    describe('and the status is ON SALE', () => {
      it('should return false', () => {
        expect(
          hasFiltersEnabled.resultFunc({
            status: AssetStatusFilter.ON_SALE
          })
        ).toBe(false)
      })
    })

    describe.each([
      [AssetStatusFilter.NOT_FOR_SALE],
      [AssetStatusFilter.ONLY_LISTING],
      [AssetStatusFilter.ONLY_MINTING]
    ])('and the status is %s', status => {
      it('should return true', () => {
        expect(
          hasFiltersEnabled.resultFunc({
            status
          })
        ).toBe(true)
      })
    })
  })

  describe('and it is the lists section', () => {
    it('should return false', () => {
      expect(
        hasFiltersEnabled.resultFunc({
          section: Sections.decentraland.LISTS
        })
      ).toBe(false)
    })
  })

  describe('when no filters are set', () => {
    it('should return false', () => {
      expect(hasFiltersEnabled.resultFunc({})).toBe(false)
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

  describe("when there's no section URL param, the vendor is Decentraland and the pathname is browse", () => {
    it("should return the decentraland's WEARABLES section", () => {
      expect(
        getSection.resultFunc('', locations.browse(), VendorName.DECENTRALAND)
      ).toBe(Sections.decentraland.WEARABLES)
    })
  })

  describe('when the section URL param is ALL, the vendor is Decentraland and the pathname is browse', () => {
    it("should return the decentraland's WEARABLES section", () => {
      expect(
        getSection.resultFunc(
          'section=all',
          locations.browse(),
          VendorName.DECENTRALAND
        )
      ).toBe(Sections.decentraland.WEARABLES)
    })
  })

  describe("when there's no section URL param, the vendor is Decentraland and the pathname is not browse but account", () => {
    it("should return the decentraland's ALL section", () => {
      expect(
        getSection.resultFunc('', locations.account(), VendorName.DECENTRALAND)
      ).toBe(Sections.decentraland.ALL)
    })
  })

  describe('when the section URL param is ALL, the vendor is Decentraland and the pathname is not browse but account', () => {
    it("should return the decentraland's ALL section", () => {
      expect(
        getSection.resultFunc(
          'section=all',
          locations.account(),
          VendorName.DECENTRALAND
        )
      ).toBe(Sections.decentraland.ALL)
    })
  })

  describe('when the section URL param exists in the vendor', () => {
    it("should return the vendor's section", () => {
      expect(
        getSection.resultFunc(
          'section=land',
          locations.lands(),
          VendorName.DECENTRALAND
        )
      ).toBe(Sections.decentraland.LAND)
    })
  })
})

describe("when there's no assetType URL param and the vendor is DECENTRALAND and the location is in browse", () => {
  it('should return ITEM as the assetType', () => {
    expect(
      getAssetType.resultFunc('', locations.browse(), VendorName.DECENTRALAND)
    ).toBe(AssetType.ITEM)
  })
})

describe("when there's assetType URL param, the assetType is not NFT or ITEM and the vendor is DECENTRALAND but the location is not in browse", () => {
  it('should return NFT as the assetType', () => {
    expect(
      getAssetType.resultFunc(
        'assetType=something',
        locations.lands(),
        VendorName.DECENTRALAND
      )
    ).toBe(AssetType.NFT)
  })
})

describe("when there's assetType URL param, the assetType is not NFT or ITEM and the vendor is DECENTRALAND and the location is in browse", () => {
  it('should return CATALOG_ITEM as the assetType', () => {
    expect(
      getAssetType.resultFunc(
        'assetType=something',
        locations.browse(),
        VendorName.DECENTRALAND
      )
    ).toBe(AssetType.ITEM)
  })
})

describe("when there's assetType URL param and the assetType is NFT", () => {
  it('should return NFT as the assetType', () => {
    expect(
      getAssetType.resultFunc(
        'assetType=nft',
        locations.browse(),
        VendorName.DECENTRALAND
      )
    ).toBe(AssetType.NFT)
  })
})

describe('when getting if it should look for NFTs that are for rent', () => {
  let url: string

  describe('and the onlyOnRent query param is set to true', () => {
    beforeEach(() => {
      url = 'onlyOnRent=true'
    })

    it('should return true', () => {
      expect(getOnlyOnRent.resultFunc(url)).toBe(true)
    })
  })

  describe('and the onlyOnRent query param is set to false', () => {
    beforeEach(() => {
      url = 'onlyOnRent=false'
    })

    it('should return false', () => {
      expect(getOnlyOnRent.resultFunc(url)).toBe(false)
    })
  })

  describe('and the onlyOnRent query param is not defined', () => {
    beforeEach(() => {
      url = ''
    })

    it('should return undefined', () => {
      expect(getOnlyOnRent.resultFunc(url)).toBe(undefined)
    })
  })
})

describe('when getting if the isMap parameter is set', () => {
  let url: string

  describe('and no isMap parameter is set', () => {
    beforeEach(() => {
      url = ''
    })

    it('should return undefined', () => {
      expect(getIsMap.resultFunc(url)).toBe(undefined)
    })
  })

  describe('and isMap is set as true', () => {
    beforeEach(() => {
      url = 'isMap=true'
    })

    it('should return true', () => {
      expect(getIsMap.resultFunc(url)).toBe(true)
    })
  })

  describe('and isMap is set as false', () => {
    beforeEach(() => {
      url = 'isMap=false'
    })

    it('should return false', () => {
      expect(getIsMap.resultFunc(url)).toBe(false)
    })
  })
})

describe('when there is a minPrice defined', () => {
  let url: string

  beforeEach(() => {
    url = 'minPrice=20'
  })

  it('should return the value', () => {
    expect(getMinPrice.resultFunc(url)).toBe('20')
  })
})

describe('when there is a maxPrice defined', () => {
  let url: string

  beforeEach(() => {
    url = 'maxPrice=120'
  })

  it('should return the value', () => {
    expect(getMaxPrice.resultFunc(url)).toBe('120')
  })
})

describe('when there is a minEstateSize defined', () => {
  let url: string

  beforeEach(() => {
    url = 'minEstateSize=20'
  })

  it('should return the value', () => {
    expect(getMinEstateSize.resultFunc(url)).toBe('20')
  })
})

describe('when there is a maxEstateSize defined', () => {
  let url: string

  beforeEach(() => {
    url = 'maxEstateSize=120'
  })

  it('should return the value', () => {
    expect(getMaxEstateSize.resultFunc(url)).toBe('120')
  })
})

describe('when there is a creator defined', () => {
  let url: string
  let anAddress: string

  beforeEach(() => {
    anAddress = '0xAddress'
    url = `creators=${anAddress}`
  })

  it('should return an array with the creator address', () => {
    expect(getCreators.resultFunc(url)).toEqual([anAddress])
  })
})

describe("when there aren't any creators defined", () => {
  let url: string
  beforeEach(() => {
    url = `sortBy=a_sort_by`
  })
  it('should return an empty array', () => {
    expect(getCreators.resultFunc(url)).toEqual([])
  })
})

describe('when getting if the SortBy parameter is set', () => {
  let url: string
  let view: View
  let section: Section
  let sortBy: string

  describe('and there is a sortBy in the url', () => {
    beforeEach(() => {
      sortBy = 'a_sort_by'
      url = `sortBy=${sortBy}`
    })
    it('should return the sortBy value', () => {
      expect(getSortBy.resultFunc(url, view, section)).toBe(sortBy)
    })
  })

  describe('and there is no sortBy in the url', () => {
    beforeEach(() => {
      sortBy = 'a_sort_by'
      url = ''
    })
    describe('and it is the account view', () => {
      beforeEach(() => {
        view = View.ACCOUNT
      })
      it('should return NEWEST as the default value', () => {
        expect(getSortBy.resultFunc(url, view, section)).toBe(SortBy.NEWEST)
      })
    })

    describe('and it is the current account view', () => {
      beforeEach(() => {
        view = View.CURRENT_ACCOUNT
      })
      it('should return NEWEST as the default value', () => {
        expect(getSortBy.resultFunc(url, view, section)).toBe(SortBy.NEWEST)
      })
    })

    describe('and it is a Parcels section', () => {
      beforeEach(() => {
        section = Sections.decentraland.PARCELS
      })
      it('should return NEWEST as the default value', () => {
        expect(getSortBy.resultFunc(url, view, section)).toBe(SortBy.NEWEST)
      })
    })

    describe('and it is a Estates section', () => {
      beforeEach(() => {
        section = Sections.decentraland.ESTATES
      })
      it('should return NEWEST as the default value', () => {
        expect(getSortBy.resultFunc(url, view, section)).toBe(SortBy.NEWEST)
      })
    })

    describe('and it is a LAND section', () => {
      beforeEach(() => {
        section = Sections.decentraland.LAND
      })
      it('should return NEWEST as the default value', () => {
        expect(getSortBy.resultFunc(url, view, section)).toBe(SortBy.NEWEST)
      })
    })

    describe('and it is not a Land section or Account view', () => {
      beforeEach(() => {
        section = Sections.decentraland.COLLECTIONS
        view = View.MARKET
        url = ''
      })
      it('should return RECENTLY_LISTED as the default value', () => {
        expect(getSortBy.resultFunc(url, view, section)).toBe(
          SortBy.RECENTLY_LISTED
        )
      })
    })
  })
})

describe('when getting if it should look for only smart NFTs', () => {
  let url: string

  describe('and the onlySmart query param is set to true', () => {
    beforeEach(() => {
      url = 'onlySmart=true'
    })

    it('should return true', () => {
      expect(getOnlySmart.resultFunc(url)).toBe(true)
    })
  })

  describe('and the onlySmart query param is set to false', () => {
    beforeEach(() => {
      url = 'onlySmart=false'
    })

    it('should return false', () => {
      expect(getOnlySmart.resultFunc(url)).toBe(false)
    })
  })

  describe('and the onlyOnRent query param is not defined', () => {
    beforeEach(() => {
      url = ''
    })

    it('should return undefined', () => {
      expect(getOnlySmart.resultFunc(url)).toBe(undefined)
    })
  })
})

describe('when getting if it should filter for guests', () => {
  let url: string

  describe('and the viewAsGuest query param is set to true', () => {
    beforeEach(() => {
      url = 'viewAsGuest=true'
    })

    it('should return true', () => {
      expect(getViewAsGuest.resultFunc(url)).toBe(true)
    })
  })

  describe('and the viewAsGuest query param is set to false', () => {
    beforeEach(() => {
      url = 'viewAsGuest=false'
    })

    it('should return false', () => {
      expect(getViewAsGuest.resultFunc(url)).toBe(false)
    })
  })

  describe('and the onlyOnRent query param is not defined', () => {
    beforeEach(() => {
      url = ''
    })

    it('should return undefined', () => {
      expect(getViewAsGuest.resultFunc(url)).toBe(undefined)
    })
  })
})

describe('when getting if the page name', () => {
  describe('and the page is not one of the known ones', () => {
    it('should throw an error', () => {
      expect(() => getPageName.resultFunc('/unknown')).toThrowError(
        'Unknown page'
      )
    })
  })

  describe.each([
    ['/', PageName.HOME],
    [locations.signIn(), PageName.SIGN_IN],
    [locations.settings(), PageName.SETTINGS],
    [locations.lands(), PageName.LANDS],
    [locations.collection('anAddress'), PageName.COLLECTION],
    [locations.browse(), PageName.BROWSE],
    [locations.campaign(), PageName.CAMPAIGN],
    [locations.currentAccount(), PageName.ACCOUNT],
    [locations.list('aListId'), PageName.LIST],
    [locations.lists(), PageName.LISTS],
    [locations.account('anAddress'), PageName.ACCOUNTS],
    [locations.nft('anAddress', 'anId'), PageName.NFT_DETAIL],
    [locations.manage('anAddress', 'anId'), PageName.MANAGE_NFT],
    [locations.item('anAddress', 'anId'), PageName.ITEM_DETAIL],
    [locations.parcel('x', 'y'), PageName.PARCEL_DETAIL],
    [locations.estate('anId'), PageName.ESTATE_DETAIL],
    [locations.buy(AssetType.NFT, 'anAddress', 'anId'), PageName.BUY_NFT],
    [locations.buy(AssetType.ITEM, 'anAddress', 'anId'), PageName.BUY_ITEM],
    [
      locations.buyStatusPage(AssetType.NFT, 'anAddress', 'anId'),
      PageName.BUY_NFT_STATUS
    ],
    [
      locations.buyStatusPage(AssetType.ITEM, 'anAddress', 'anId'),
      PageName.BUY_ITEM_STATUS
    ],
    [locations.cancel('anAddress', 'anId'), PageName.CANCEL_NFT_SALE],
    [locations.transfer('anAddress', 'anId'), PageName.TRANSFER_NFT],
    [locations.bid('anAddress', 'anId'), PageName.BID_NFT],
    [locations.activity(), PageName.ACTIVITY]
  ])('and the current path is "%s"', (pathname, expectedName) => {
    it(`should return the page name ${expectedName}`, () => {
      expect(getPageName.resultFunc(pathname)).toBe(expectedName)
    })
  })
})

describe('when there a status defined', () => {
  let url: string
  let status: string
  beforeEach(() => {
    status = 'only_minting'
    url = `status=${status}`
  })
  it('should return an empty array', () => {
    expect(getStatus.resultFunc(url)).toEqual(status)
  })
})

describe('when getting the Sort By options', () => {
  const baseSortByOptions = [
    getAllSortByOptions()[SortBy.NEWEST],
    getAllSortByOptions()[SortBy.RECENTLY_LISTED],
    getAllSortByOptions()[SortBy.RECENTLY_SOLD],
    getAllSortByOptions()[SortBy.CHEAPEST],
    getAllSortByOptions()[SortBy.MOST_EXPENSIVE]
  ]
  let status: AssetStatusFilter
  describe('and the status is defined', () => {
    describe('and the status is ON_SALE', () => {
      beforeEach(() => {
        status = AssetStatusFilter.ON_SALE
      })
      it('should return the base sort options array', () => {
        expect(getSortByOptions.resultFunc(true, true, status)).toEqual(
          baseSortByOptions
        )
      })
    })
    describe('and the status is ONLY_MINTING', () => {
      beforeEach(() => {
        status = AssetStatusFilter.ONLY_MINTING
      })
      it('should return the base sort options array', () => {
        expect(getSortByOptions.resultFunc(true, true, status)).toEqual(
          baseSortByOptions
        )
      })
    })
    describe('and the status is ONLY_LISTING', () => {
      beforeEach(() => {
        status = AssetStatusFilter.ONLY_LISTING
      })
      it('should return the base sort options', () => {
        expect(getSortByOptions.resultFunc(true, true, status)).toEqual(
          baseSortByOptions
        )
      })
    })
    describe('and the status is NOT_FOR_SALE', () => {
      beforeEach(() => {
        status = AssetStatusFilter.NOT_FOR_SALE
      })
      it('should return an array with just the newest option', () => {
        expect(getSortByOptions.resultFunc(true, true, status)).toEqual([
          getAllSortByOptions()[SortBy.NEWEST]
        ])
      })
    })
  })
  describe('and the status is not defined', () => {
    let status: string
    beforeEach(() => {
      status = ''
    })
    describe('and the "onlyOnRent" is true', () => {
      describe('and the "onlyOnSale" is false', () => {
        it('should return an array with the valid on rent sort options', () => {
          expect(getSortByOptions.resultFunc(true, false, status)).toEqual([
            getAllSortByOptions()[SortBy.RENTAL_LISTING_DATE],
            getAllSortByOptions()[SortBy.NAME],
            getAllSortByOptions()[SortBy.NEWEST],
            getAllSortByOptions()[SortBy.MAX_RENTAL_PRICE]
          ])
        })
      })
    })
    describe('and the "onlyOnSale" is true', () => {
      describe('and the "onlyOnRent" is false', () => {
        it('should return an array with just the valid on sale sort options', () => {
          expect(getSortByOptions.resultFunc(false, true, status)).toEqual([
            getAllSortByOptions()[SortBy.RECENTLY_LISTED],
            getAllSortByOptions()[SortBy.RECENTLY_SOLD],
            getAllSortByOptions()[SortBy.CHEAPEST],
            getAllSortByOptions()[SortBy.NEWEST],
            getAllSortByOptions()[SortBy.NAME]
          ])
        })
      })
    })
  })
})
