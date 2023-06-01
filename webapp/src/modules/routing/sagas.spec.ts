import {
  EmotePlayMode,
  GenderFilterOption,
  ItemSortBy,
  NFTCategory,
  Network,
  Rarity
} from '@dcl/schemas'
import {
  getLocation,
  LOCATION_CHANGE,
  LocationChangeAction,
  push,
  RouterLocation
} from 'connected-react-router'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga/effects'
import { AssetStatusFilter } from '../../utils/filters'
import { AssetType } from '../asset/types'
import { getData as getEventData } from '../event/selectors'
import { fetchFavoritedItemsRequest } from '../favorites/actions'
import { fetchItemsRequest, fetchTrendingItemsRequest } from '../item/actions'
import { ItemBrowseOptions } from '../item/types'
import { getPage } from '../ui/browse/selectors'
import { PAGE_SIZE } from '../vendor/api'
import { View } from '../ui/types'
import { VendorName } from '../vendor'
import { Section } from '../vendor/decentraland'
import { locations } from './locations'
import {
  browse,
  clearFilters,
  fetchAssetsFromRoute as fetchAssetsFromRouteAction
} from './actions'
import { fetchAssetsFromRoute, getNewBrowseOptions, routingSaga } from './sagas'
import {
  getCurrentBrowseOptions,
  getLatestVisitedLocation,
  getSection
} from './selectors'
import { BrowseOptions, SortBy } from './types'
import { buildBrowseURL } from './utils'

beforeEach(() => {
  jest.spyOn(Date, 'now').mockReturnValue(100)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('when handling the clear filters request action', () => {
  let browseOptions: BrowseOptions
  let browseOptionsWithoutFilters: BrowseOptions
  let pathname: string
  beforeEach(() => {
    browseOptions = {
      assetType: AssetType.ITEM,
      address: '0x...',
      vendor: VendorName.DECENTRALAND,
      section: Section.LAND,
      page: 1,
      view: View.MARKET,
      sortBy: SortBy.NAME,
      search: 'aText',
      onlyOnSale: true,
      isMap: false,
      isFullscreen: false,
      rarities: [Rarity.EPIC],
      wearableGenders: [GenderFilterOption.FEMALE],
      contracts: ['aContract'],
      network: Network.ETHEREUM,
      emotePlayMode: [EmotePlayMode.SIMPLE],
      minPrice: '1',
      maxPrice: '100',
      minEstateSize: '1',
      maxEstateSize: '2'
    }
    browseOptionsWithoutFilters = { ...browseOptions }
    delete browseOptionsWithoutFilters.rarities
    delete browseOptionsWithoutFilters.wearableGenders
    delete browseOptionsWithoutFilters.network
    delete browseOptionsWithoutFilters.contracts
    delete browseOptionsWithoutFilters.emotePlayMode
    delete browseOptionsWithoutFilters.minPrice
    delete browseOptionsWithoutFilters.maxPrice
    delete browseOptionsWithoutFilters.minEstateSize
    delete browseOptionsWithoutFilters.maxEstateSize
    delete browseOptionsWithoutFilters.search
    delete browseOptionsWithoutFilters.onlyOnSale
    browseOptionsWithoutFilters.page = 1
    pathname = 'aPath'
  })
  describe('and the filters are set', () => {
    it('should build a browseURL without the filter values that got resetted', () => {
      return expectSaga(routingSaga)
        .provide([
          [select(getCurrentBrowseOptions), browseOptions],
          [select(getLocation), { pathname }],
          [select(getEventData), {}],
          [
            call(fetchAssetsFromRoute, browseOptionsWithoutFilters),
            Promise.resolve()
          ]
        ])
        .put(push(buildBrowseURL(pathname, browseOptionsWithoutFilters)))
        .dispatch(clearFilters())
        .run({ silenceTimeout: true })
    })
  })

  describe('and the onlyOnSale filter is set to "true"', () => {
    it("should fetch assets and change the URL by clearing the filter's browse options and restarting the page counter", () => {
      return expectSaga(routingSaga)
        .provide([
          [select(getCurrentBrowseOptions), browseOptions],
          [select(getLocation), { pathname }],
          [select(getEventData), {}],
          [
            call(fetchAssetsFromRoute, browseOptionsWithoutFilters),
            Promise.resolve()
          ]
        ])
        .put(push(buildBrowseURL(pathname, browseOptionsWithoutFilters)))
        .dispatch(clearFilters())
        .run({ silenceTimeout: true })
    })

    describe('and it is not the LAND section', () => {
      describe('and the asset type is Item', () => {
        it("should fetch assets and change the URL by clearing the filter's browse options and restarting the page counter and delete the onlyOnSale filter", () => {
          return expectSaga(routingSaga)
            .provide([
              [
                select(getCurrentBrowseOptions),
                {
                  ...browseOptions,
                  onlyOnSale: false,
                  section: Section.COLLECTIONS,
                  assetType: AssetType.NFT
                }
              ],
              [select(getPage), 1],
              [select(getLocation), { pathname }],
              [select(getEventData), {}],
              [
                call(fetchAssetsFromRoute, browseOptionsWithoutFilters),
                Promise.resolve()
              ]
            ])
            .put(
              push(
                buildBrowseURL(pathname, {
                  ...browseOptionsWithoutFilters,
                  section: Section.COLLECTIONS,
                  assetType: AssetType.NFT,
                  status: AssetStatusFilter.ON_SALE
                })
              )
            )
            .dispatch(clearFilters())
            .run({ silenceTimeout: true })
        })
      })
      describe('and the asset type is NFT', () => {
        it("should fetch assets and change the URL by clearing the filter's browse options and restarting the page counter and remove the onlyOnSale filter", () => {
          return expectSaga(routingSaga)
            .provide([
              [
                select(getCurrentBrowseOptions),
                {
                  ...browseOptions,
                  onlyOnSale: true,
                  section: Section.WEARABLES,
                  assetType: AssetType.NFT,
                  view: View.CURRENT_ACCOUNT
                }
              ],
              [select(getPage), 1],
              [select(getLocation), { pathname }],
              [select(getEventData), {}],
              [
                call(fetchAssetsFromRoute, browseOptionsWithoutFilters),
                Promise.resolve()
              ]
            ])
            .put(
              push(
                buildBrowseURL(pathname, {
                  ...browseOptionsWithoutFilters,
                  section: Section.WEARABLES,
                  onlyOnSale: true,
                  assetType: AssetType.NFT
                })
              )
            )
            .dispatch(clearFilters())
            .run({ silenceTimeout: true })
        })
      })
    })
  })
})

describe('when handling the fetchAssetsFromRoute request action', () => {
  it('should fetch trending items when providing the WEARABLES_TRENDING section', () => {
    const browseOptions: BrowseOptions = {
      address: '0x...',
      vendor: VendorName.DECENTRALAND,
      section: Section.WEARABLES_TRENDING
    } as BrowseOptions

    return expectSaga(routingSaga)
      .provide([
        [select(getCurrentBrowseOptions), browseOptions],
        [select(getPage), 1],
        [select(getSection), Section.WEARABLES]
      ])
      .put(fetchTrendingItemsRequest())
      .dispatch(fetchAssetsFromRouteAction(browseOptions))
      .run({ silenceTimeout: true })
  })

  it('should fetch emotes items when providing the EMOTES section', () => {
    const address = '0x...'
    const browseOptions: BrowseOptions = {
      address,
      assetType: AssetType.ITEM,
      vendor: VendorName.DECENTRALAND,
      section: Section.EMOTES,
      view: View.ACCOUNT,
      page: 1
    }

    const filters: ItemBrowseOptions = {
      view: browseOptions.view,
      page: browseOptions.page,
      filters: {
        first: 24,
        skip: 0,
        sortBy: ItemSortBy.CHEAPEST,
        creator: [address],
        category: NFTCategory.EMOTE,
        isWearableHead: false,
        isWearableAccessory: false,
        isOnSale: undefined,
        wearableCategory: undefined,
        emoteCategory: undefined,
        isWearableSmart: undefined,
        search: undefined,
        rarities: undefined,
        contractAddresses: undefined,
        wearableGenders: undefined,
        emotePlayMode: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        network: undefined
      }
    }

    return expectSaga(routingSaga)
      .provide([
        [call(getNewBrowseOptions, browseOptions), browseOptions],
        [select(getPage), 1],
        [select(getSection), Section.WEARABLES]
      ])
      .put(fetchItemsRequest(filters))
      .dispatch(fetchAssetsFromRouteAction(browseOptions))
      .run({ silenceTimeout: true })
  })

  it('should fetch favorited items when providing the LISTS section', () => {
    const browseOptions: BrowseOptions = {
      page: 1,
      address: '0x...',
      vendor: VendorName.DECENTRALAND,
      section: Section.LISTS,
      view: View.LISTS
    } as BrowseOptions

    const filters: ItemBrowseOptions = {
      view: browseOptions.view,
      page: browseOptions.page,
      section: browseOptions.section as Section,
      filters: {
        first: 24,
        skip: 0
      }
    }

    return expectSaga(routingSaga)
      .provide([
        [select(getCurrentBrowseOptions), browseOptions],
        [select(getSection), Section.LISTS],
        [select(getPage), 1]
      ])
      .put(fetchFavoritedItemsRequest(filters))
      .dispatch(fetchAssetsFromRouteAction(browseOptions))
      .run({ silenceTimeout: true })
  })

  describe('and the section is WEARABLES', () => {
    describe('and there is a page in previous state', () => {
      const pageInState = 1
      const address = '0x...'
      const browseOptions: BrowseOptions = {
        address,
        vendor: VendorName.DECENTRALAND,
        section: Section.WEARABLES,
        page: pageInState + 1,
        assetType: AssetType.ITEM
      } as BrowseOptions
      const filters: ItemBrowseOptions = {
        view: browseOptions.view,
        page: browseOptions.page,
        filters: {
          first: (browseOptions.page! - 1) * PAGE_SIZE,
          skip: pageInState * PAGE_SIZE, // should skip one page
          creator: [address],
          sortBy: ItemSortBy.RECENTLY_REVIEWED,
          category: NFTCategory.WEARABLE,
          isWearableHead: false,
          isWearableAccessory: false,
          isOnSale: undefined,
          wearableCategory: undefined,
          emoteCategory: undefined,
          isWearableSmart: undefined,
          search: undefined,
          rarities: undefined,
          contractAddresses: undefined,
          wearableGenders: undefined,
          emotePlayMode: undefined,
          minPrice: undefined,
          maxPrice: undefined,
          network: undefined
        }
      }
      it('should fetch assets with the correct skip size', () => {
        return expectSaga(routingSaga)
          .provide([
            [
              select(getCurrentBrowseOptions),
              { ...browseOptions, section: Section.WEARABLES_TRENDING }
            ],
            [select(getPage), pageInState],
            [select(getSection), Section.WEARABLES_TRENDING]
          ])
          .put(fetchItemsRequest(filters))
          .dispatch(fetchAssetsFromRouteAction(browseOptions))
          .run({ silenceTimeout: true })
      })
    })
    describe('and there is no page in previous state', () => {
      describe('and the page asked is greater than the first one', () => {
        const page = 3
        const address = '0x...'
        const browseOptions: BrowseOptions = {
          address,
          vendor: VendorName.DECENTRALAND,
          section: Section.WEARABLES,
          page,
          assetType: AssetType.ITEM
        } as BrowseOptions
        const filters: ItemBrowseOptions = {
          view: browseOptions.view,
          page: browseOptions.page,
          filters: {
            first: page * PAGE_SIZE,
            skip: 0,
            creator: [address],
            sortBy: ItemSortBy.RECENTLY_REVIEWED,
            category: NFTCategory.WEARABLE,
            isWearableHead: false,
            isWearableAccessory: false,
            isOnSale: undefined,
            wearableCategory: undefined,
            emoteCategory: undefined,
            isWearableSmart: undefined,
            search: undefined,
            rarities: undefined,
            contractAddresses: undefined,
            wearableGenders: undefined,
            emotePlayMode: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            network: undefined
          }
        }
        it('should fetch assets with the correct skip size', () => {
          return expectSaga(routingSaga)
            .provide([
              [
                select(getCurrentBrowseOptions),
                { ...browseOptions, section: Section.WEARABLES_TRENDING }
              ],
              [select(getPage), undefined],
              [select(getSection), Section.WEARABLES_TRENDING]
            ])
            .put(fetchItemsRequest(filters))
            .dispatch(fetchAssetsFromRouteAction(browseOptions))
            .run({ silenceTimeout: true })
        })
      })
    })
  })
})

describe('when handling the browse action', () => {
  let browseOptions: BrowseOptions
  let newBrowseOptions: BrowseOptions
  let expectedBrowseOptions: BrowseOptions
  let pathname: string

  beforeEach(() => {
    pathname = 'aPathName'
    browseOptions = {
      onlyOnSale: undefined,
      sortBy: undefined,
      page: 1,
      onlyOnRent: undefined,
      isMap: undefined,
      isFullscreen: undefined,
      viewAsGuest: undefined,
      assetType: AssetType.NFT,
      section: Section.LAND,
      view: undefined,
      vendor: VendorName.DECENTRALAND
    }
    newBrowseOptions = {}
  })

  describe('and the onlyOnRent filter is to be set', () => {
    beforeEach(() => {
      newBrowseOptions.onlyOnRent = true
    })

    describe('and the browse action has a new non rental sort to be set', () => {
      beforeEach(() => {
        newBrowseOptions.sortBy = undefined
      })

      describe('and no previous sort is set', () => {
        beforeEach(() => {
          browseOptions.sortBy = undefined
          expectedBrowseOptions = {
            ...browseOptions,
            ...newBrowseOptions,
            sortBy: undefined
          }
        })

        it('should fetch the assets and put the new url using with the sortBy option as undefined', () => {
          return expectSaga(routingSaga)
            .provide([
              [select(getCurrentBrowseOptions), browseOptions],
              [select(getLocation), { pathname }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [
                call(fetchAssetsFromRoute, expectedBrowseOptions),
                Promise.resolve()
              ]
            ])
            .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
        })
      })

      describe('and a previous sort is set', () => {
        beforeEach(() => {
          browseOptions.sortBy = SortBy.NEWEST
          expectedBrowseOptions = {
            ...browseOptions,
            ...newBrowseOptions,
            sortBy: undefined
          }
        })

        it('should fetch the assets and put the new url using with the sortBy option as undefined', () => {
          return expectSaga(routingSaga)
            .provide([
              [select(getCurrentBrowseOptions), browseOptions],
              [select(getLocation), { pathname }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [
                call(fetchAssetsFromRoute, expectedBrowseOptions),
                Promise.resolve()
              ]
            ])
            .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
        })
      })
    })

    describe('and the browse action has a new rental sort', () => {
      beforeEach(() => {
        newBrowseOptions.sortBy = SortBy.RENTAL_LISTING_DATE
        expectedBrowseOptions = {
          ...browseOptions,
          ...newBrowseOptions
        }
      })

      it('should fetch the assets and put the new url using with the sortBy option as the new rental sort', () => {
        return expectSaga(routingSaga)
          .provide([
            [select(getCurrentBrowseOptions), browseOptions],
            [select(getLocation), { pathname }],
            [select(getSection), Section.WEARABLES],
            [select(getEventData), {}],
            [
              call(fetchAssetsFromRoute, expectedBrowseOptions),
              Promise.resolve()
            ]
          ])
          .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
          .dispatch(browse(newBrowseOptions))
          .run({ silenceTimeout: true })
      })
    })

    describe('and the browse action has a previous non rental sort', () => {
      beforeEach(() => {
        browseOptions.sortBy = SortBy.RECENTLY_SOLD
        expectedBrowseOptions = {
          ...browseOptions,
          ...newBrowseOptions,
          sortBy: undefined
        }
      })

      it('should fetch the assets and put the new url using with the sortBy option as undefined', () => {
        return expectSaga(routingSaga)
          .provide([
            [select(getCurrentBrowseOptions), browseOptions],
            [select(getLocation), { pathname }],
            [select(getSection), Section.WEARABLES],
            [select(getEventData), {}],
            [
              call(fetchAssetsFromRoute, expectedBrowseOptions),
              Promise.resolve()
            ]
          ])
          .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
          .dispatch(browse(newBrowseOptions))
          .run({ silenceTimeout: true })
      })
    })
  })

  describe('and the onlyOnRent filter is already set', () => {
    beforeEach(() => {
      browseOptions.onlyOnRent = true
    })

    describe('and the browse action has a new non rental sort to be set', () => {
      beforeEach(() => {
        newBrowseOptions.sortBy = SortBy.CHEAPEST
      })

      describe('and no previous sort is set', () => {
        beforeEach(() => {
          browseOptions.sortBy = undefined
          expectedBrowseOptions = {
            ...browseOptions,
            ...newBrowseOptions,
            sortBy: undefined
          }
        })

        it('should fetch the assets and put the new url using with the sortBy option as undefined', () => {
          return expectSaga(routingSaga)
            .provide([
              [select(getCurrentBrowseOptions), browseOptions],
              [select(getLocation), { pathname }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [
                call(fetchAssetsFromRoute, expectedBrowseOptions),
                Promise.resolve()
              ]
            ])
            .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
        })
      })

      describe('and a previous sort is set', () => {
        beforeEach(() => {
          browseOptions.sortBy = SortBy.NEWEST
          expectedBrowseOptions = {
            ...browseOptions,
            ...newBrowseOptions,
            sortBy: undefined
          }
        })

        it('should fetch the assets and put the new url using with the sortBy option as undefined', () => {
          return expectSaga(routingSaga)
            .provide([
              [select(getCurrentBrowseOptions), browseOptions],
              [select(getLocation), { pathname }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [
                call(fetchAssetsFromRoute, expectedBrowseOptions),
                Promise.resolve()
              ]
            ])
            .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
        })
      })
    })

    describe('and the browse action does not have a new sort to be set', () => {
      beforeEach(() => {
        newBrowseOptions.sortBy = undefined
      })

      describe('and the previous sort is not set', () => {
        beforeEach(() => {
          browseOptions.sortBy = undefined
          expectedBrowseOptions = {
            ...browseOptions,
            ...newBrowseOptions,
            sortBy: undefined
          }
        })

        it('should fetch the assets and put the new url using with the sortBy option as undefined', () => {
          return expectSaga(routingSaga)
            .provide([
              [select(getCurrentBrowseOptions), browseOptions],
              [select(getLocation), { pathname }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [
                call(fetchAssetsFromRoute, expectedBrowseOptions),
                Promise.resolve()
              ]
            ])
            .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
        })
      })

      describe('and the previous sort is set to a non rental sort', () => {
        beforeEach(() => {
          browseOptions.sortBy = SortBy.CHEAPEST
          expectedBrowseOptions = {
            ...browseOptions,
            ...newBrowseOptions
          }
        })

        it('should fetch the assets and put the new url using with the sortBy option as the previous one', () => {
          return expectSaga(routingSaga)
            .provide([
              [select(getCurrentBrowseOptions), browseOptions],
              [select(getLocation), { pathname }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [
                call(fetchAssetsFromRoute, expectedBrowseOptions),
                Promise.resolve()
              ]
            ])
            .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
        })
      })

      describe('and the previous sort is set to a rental sort', () => {
        beforeEach(() => {
          browseOptions.sortBy = SortBy.RENTAL_LISTING_DATE
          expectedBrowseOptions = {
            ...browseOptions,
            ...newBrowseOptions
          }
        })

        it('should fetch the assets and put the new url using with the sortBy option as the previous one', () => {
          return expectSaga(routingSaga)
            .provide([
              [select(getCurrentBrowseOptions), browseOptions],
              [select(getLocation), { pathname }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [
                call(fetchAssetsFromRoute, expectedBrowseOptions),
                Promise.resolve()
              ]
            ])
            .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
        })
      })
    })

    describe('and the browse action has a new rental sort to be set', () => {
      beforeEach(() => {
        newBrowseOptions.sortBy = SortBy.RENTAL_LISTING_DATE
        expectedBrowseOptions = {
          ...browseOptions,
          ...newBrowseOptions
        }
      })

      it('should fetch the assets and put the new url using with the sortBy option as the new rental sort', () => {
        return expectSaga(routingSaga)
          .provide([
            [select(getCurrentBrowseOptions), browseOptions],
            [select(getLocation), { pathname }],
            [select(getSection), Section.WEARABLES],
            [select(getEventData), {}],
            [
              call(fetchAssetsFromRoute, expectedBrowseOptions),
              Promise.resolve()
            ]
          ])
          .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
          .dispatch(browse(newBrowseOptions))
          .run({ silenceTimeout: true })
      })
    })
  })

  describe('and the onlyOnSell filter is to be set', () => {
    beforeEach(() => {
      newBrowseOptions.onlyOnSale = true
    })

    describe('and the browse action has a new non sell sort to be set', () => {
      beforeEach(() => {
        newBrowseOptions.sortBy = undefined
      })

      describe('and no previous sort is set', () => {
        beforeEach(() => {
          browseOptions.sortBy = undefined
          expectedBrowseOptions = {
            ...browseOptions,
            ...newBrowseOptions,
            sortBy: undefined
          }
        })

        it('should fetch the assets and put the new url using with the sortBy option as undefined', () => {
          return expectSaga(routingSaga)
            .provide([
              [select(getCurrentBrowseOptions), browseOptions],
              [select(getLocation), { pathname }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [
                call(fetchAssetsFromRoute, expectedBrowseOptions),
                Promise.resolve()
              ]
            ])
            .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
        })
      })

      describe('and a previous sort is set', () => {
        beforeEach(() => {
          browseOptions.sortBy = SortBy.NEWEST
          expectedBrowseOptions = {
            ...browseOptions,
            ...newBrowseOptions,
            sortBy: undefined
          }
        })

        it('should fetch the assets and put the new url using with the sortBy option as undefined', () => {
          return expectSaga(routingSaga)
            .provide([
              [select(getCurrentBrowseOptions), browseOptions],
              [select(getLocation), { pathname }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [
                call(fetchAssetsFromRoute, expectedBrowseOptions),
                Promise.resolve()
              ]
            ])
            .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
        })
      })
    })

    describe('and the browse action has a new sell sort', () => {
      beforeEach(() => {
        newBrowseOptions.sortBy = SortBy.RECENTLY_SOLD
        expectedBrowseOptions = {
          ...browseOptions,
          ...newBrowseOptions
        }
      })

      it('should fetch the assets and put the new url using with the sortBy option as the new sell sort', () => {
        return expectSaga(routingSaga)
          .provide([
            [select(getCurrentBrowseOptions), browseOptions],
            [select(getLocation), { pathname }],
            [select(getSection), Section.WEARABLES],
            [select(getEventData), {}],
            [
              call(fetchAssetsFromRoute, expectedBrowseOptions),
              Promise.resolve()
            ]
          ])
          .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
          .dispatch(browse(newBrowseOptions))
          .run({ silenceTimeout: true })
      })
    })

    describe('and the browse action has a previous non sell sort', () => {
      beforeEach(() => {
        browseOptions.sortBy = SortBy.RENTAL_LISTING_DATE
        expectedBrowseOptions = {
          ...browseOptions,
          ...newBrowseOptions,
          sortBy: undefined
        }
      })

      it('should fetch the assets and put the new url using with the sortBy option as undefined', () => {
        return expectSaga(routingSaga)
          .provide([
            [select(getCurrentBrowseOptions), browseOptions],
            [select(getLocation), { pathname }],
            [select(getSection), Section.WEARABLES],
            [select(getEventData), {}],
            [
              call(fetchAssetsFromRoute, expectedBrowseOptions),
              Promise.resolve()
            ]
          ])
          .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
          .dispatch(browse(newBrowseOptions))
          .run({ silenceTimeout: true })
      })
    })
  })

  describe('and the onlyOnSell filter is set', () => {
    beforeEach(() => {
      browseOptions.onlyOnSale = true
    })

    describe('and the browse action has a new non sell sort to be set', () => {
      beforeEach(() => {
        newBrowseOptions.sortBy = SortBy.MAX_RENTAL_PRICE
      })

      describe('and no previous sort is set', () => {
        beforeEach(() => {
          browseOptions.sortBy = undefined
          expectedBrowseOptions = {
            ...browseOptions,
            ...newBrowseOptions,
            sortBy: undefined
          }
        })

        it('should fetch the assets and put the new url using with the sortBy option as undefined', () => {
          return expectSaga(routingSaga)
            .provide([
              [select(getCurrentBrowseOptions), browseOptions],
              [select(getLocation), { pathname }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [
                call(fetchAssetsFromRoute, expectedBrowseOptions),
                Promise.resolve()
              ]
            ])
            .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
        })
      })

      describe('and a previous sort is set', () => {
        beforeEach(() => {
          browseOptions.sortBy = SortBy.NEWEST
          expectedBrowseOptions = {
            ...browseOptions,
            ...newBrowseOptions,
            sortBy: undefined
          }
        })

        it('should fetch the assets and put the new url using with the sortBy option as undefined', () => {
          return expectSaga(routingSaga)
            .provide([
              [select(getCurrentBrowseOptions), browseOptions],
              [select(getLocation), { pathname }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [
                call(fetchAssetsFromRoute, expectedBrowseOptions),
                Promise.resolve()
              ]
            ])
            .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
        })
      })
    })

    describe('and the browse action does not have a new sort to be set', () => {
      beforeEach(() => {
        newBrowseOptions.sortBy = undefined
      })

      describe('and the previous sort is not set', () => {
        beforeEach(() => {
          browseOptions.sortBy = undefined
          expectedBrowseOptions = {
            ...browseOptions,
            ...newBrowseOptions,
            sortBy: undefined
          }
        })

        it('should fetch the assets and put the new url using with the sortBy option as undefined', () => {
          return expectSaga(routingSaga)
            .provide([
              [select(getCurrentBrowseOptions), browseOptions],
              [select(getLocation), { pathname }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [
                call(fetchAssetsFromRoute, expectedBrowseOptions),
                Promise.resolve()
              ]
            ])
            .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
        })
      })

      describe('and the previous sort is set to a non rental sort', () => {
        beforeEach(() => {
          browseOptions.sortBy = SortBy.CHEAPEST
          expectedBrowseOptions = {
            ...browseOptions,
            ...newBrowseOptions
          }
        })

        it('should fetch the assets and put the new url using with the sortBy option as the previous one', () => {
          return expectSaga(routingSaga)
            .provide([
              [select(getCurrentBrowseOptions), browseOptions],
              [select(getLocation), { pathname }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [
                call(fetchAssetsFromRoute, expectedBrowseOptions),
                Promise.resolve()
              ]
            ])
            .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
        })
      })

      describe('and the previous sort is set to a rental sort', () => {
        beforeEach(() => {
          browseOptions.sortBy = SortBy.RENTAL_LISTING_DATE
          expectedBrowseOptions = {
            ...browseOptions,
            ...newBrowseOptions
          }
        })

        it('should fetch the assets and put the new url using with the sortBy option as the previous one', () => {
          return expectSaga(routingSaga)
            .provide([
              [select(getCurrentBrowseOptions), browseOptions],
              [select(getLocation), { pathname }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [
                call(fetchAssetsFromRoute, expectedBrowseOptions),
                Promise.resolve()
              ]
            ])
            .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
        })
      })
    })

    describe('and the browse action has a new sell sort to be set', () => {
      beforeEach(() => {
        newBrowseOptions.sortBy = SortBy.CHEAPEST
        expectedBrowseOptions = {
          ...browseOptions,
          ...newBrowseOptions
        }
      })

      it('should fetch the assets and put the new url using with the sortBy option as the new sell sort', () => {
        return expectSaga(routingSaga)
          .provide([
            [select(getCurrentBrowseOptions), browseOptions],
            [select(getLocation), { pathname }],
            [select(getSection), Section.WEARABLES],
            [select(getEventData), {}],
            [
              call(fetchAssetsFromRoute, expectedBrowseOptions),
              Promise.resolve()
            ]
          ])
          .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
          .dispatch(browse(newBrowseOptions))
          .run({ silenceTimeout: true })
      })
    })
  })

  describe('and its navigating to an event route', () => {
    let contracts: string[]
    let eventContracts: Record<string, string[]>
    beforeEach(() => {
      pathname = '/anEventName'
      contracts = ['0x1', '0x2']
      newBrowseOptions = {
        ...newBrowseOptions,
        contracts
      }
      eventContracts = { anEventName: contracts }
      expectedBrowseOptions = {
        ...browseOptions,
        ...newBrowseOptions
      }
    })

    it('should fetch the assets with the contracts param and put the new url should not have the contracts param', () => {
      return expectSaga(routingSaga)
        .provide([
          [select(getCurrentBrowseOptions), browseOptions],
          [select(getLocation), { pathname }],
          [select(getSection), Section.WEARABLES],
          [select(getEventData), eventContracts],
          [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
        ])
        .put(push(buildBrowseURL(pathname, browseOptions)))
        .dispatch(browse(browseOptions))
        .run({ silenceTimeout: true })
    })
  })

  describe('and its not navigating to an event route', () => {
    let contracts: string[]
    let eventContracts: Record<string, string[]>
    beforeEach(() => {
      pathname = '/notAnEventName'
      contracts = ['0x1', '0x2']
      eventContracts = { anEventName: contracts }
    })

    it('should fetch the assets without the contracts param and put the new url should not have the contracts param', () => {
      return expectSaga(routingSaga)
        .provide([
          [select(getCurrentBrowseOptions), browseOptions],
          [select(getLocation), { pathname }],
          [select(getSection), Section.WEARABLES],
          [select(getEventData), eventContracts],
          [call(fetchAssetsFromRoute, browseOptions), Promise.resolve()]
        ])
        .put(push(buildBrowseURL(pathname, browseOptions)))
        .dispatch(browse(browseOptions))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the section is lists', () => {
    beforeEach(() => {
      newBrowseOptions = {
        assetType: AssetType.ITEM,
        section: Section.LISTS,
        view: View.LISTS,
        vendor: VendorName.DECENTRALAND
      }
      expectedBrowseOptions = {
        ...newBrowseOptions,
        page: 1,
        onlyOnSale: undefined,
        onlyOnRent: undefined,
        sortBy: undefined,
        isMap: undefined,
        isFullscreen: undefined,
        viewAsGuest: undefined
      }
    })

    it('should fetch the assets and put the new url using only page, section, vendor, view, and asset type', () => {
      return expectSaga(routingSaga)
        .provide([
          [select(getCurrentBrowseOptions), {}],
          [select(getSection), Section.WEARABLES],
          [select(getLocation), { pathname }],
          [select(getEventData), {}],
          [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
        ])
        .put(push(buildBrowseURL(pathname, expectedBrowseOptions)))
        .dispatch(browse(newBrowseOptions))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the location change action', () => {
  let browseOptions: BrowseOptions,
    location: RouterLocation<unknown>,
    locationChangeAction: LocationChangeAction<unknown>
  beforeEach(() => {
    browseOptions = {
      view: View.MARKET,
      address: '0x...'
    }
    location = {
      pathname: 'aPathName',
      search: 'aSearch',
      hash: 'aHash',
      state: {},
      key: 'aKey',
      query: {}
    }
    locationChangeAction = {
      type: LOCATION_CHANGE,
      payload: {
        isFirstRendering: false,
        location,
        action: 'POP'
      }
    }
  })
  describe('and the location action is a POP, meaning going back', () => {
    describe("and the current pathname doesn't match the browse", () => {
      beforeEach(() => {
        locationChangeAction.payload.location.pathname = 'anotherPathName'
      })
      it('should not call the fetchAssetFromRoute', () => {
        return expectSaga(routingSaga)
          .provide([
            [
              select(getLatestVisitedLocation),
              {
                pathname: locations.browse()
              }
            ],
            [select(getCurrentBrowseOptions), browseOptions],
            [select(getSection), Section.WEARABLES],
            [select(getPage), 1]
          ])
          .not.put(fetchAssetsFromRouteAction(browseOptions))
          .dispatch(locationChangeAction)
          .run({ silenceTimeout: true })
      })
    })
    describe('and its coming from the browse', () => {
      beforeEach(() => {
        locationChangeAction.payload.location.pathname = locations.browse()
      })
      it('should dispatch the fetchAssetFromRoute action', () => {
        return expectSaga(routingSaga)
          .provide([
            [
              select(getLatestVisitedLocation),
              {
                pathname: locations.browse()
              }
            ],
            [select(getCurrentBrowseOptions), browseOptions],
            [select(getSection), Section.WEARABLES],
            [select(getPage), 1]
          ])
          .put(fetchAssetsFromRouteAction(browseOptions))
          .dispatch(locationChangeAction)
          .run({ silenceTimeout: true })
      })
    })
    describe('and its coming from another route', () => {
      it('should not dispatch the fetchAssetFromRoute action', () => {
        return expectSaga(routingSaga)
          .provide([
            [
              select(getLatestVisitedLocation),
              {
                pathname: 'aNotBrowsePath'
              }
            ],
            [select(getCurrentBrowseOptions), browseOptions],
            [select(getSection), Section.WEARABLES],
            [select(getPage), 1]
          ])
          .not.put(fetchAssetsFromRouteAction(browseOptions))
          .dispatch(locationChangeAction)
          .run({ silenceTimeout: true })
      })
    })
  })
  describe('and the location action is not a POP', () => {
    beforeEach(() => {
      locationChangeAction.payload.action = 'PUSH'
    })
    it('should not dispatch the fetchAssetFromRoute action', () => {
      return expectSaga(routingSaga)
        .provide([[select(getCurrentBrowseOptions), browseOptions]])
        .not.put(fetchAssetsFromRouteAction(browseOptions))
        .dispatch(locationChangeAction)
        .run({ silenceTimeout: true })
    })
  })
})
