import {
  ItemFilters,
  ItemSortBy,
  Network,
  NFTCategory,
  Rarity
} from '@dcl/schemas'
import { getLocation, push } from 'connected-react-router'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga/effects'
import { AssetType } from '../asset/types'
import { fetchItemsRequest, fetchTrendingItemsRequest } from '../item/actions'
import { WearableGender } from '../nft/wearable/types'
import { View } from '../ui/types'
import { VendorName } from '../vendor'
import { Section } from '../vendor/decentraland'
import {
  browse,
  clearFilters,
  fetchAssetsFromRoute as FetchAssetsFromRouteAction
} from './actions'
import { fetchAssetsFromRoute, getNewBrowseOptions, routingSaga } from './sagas'
import { getCurrentBrowseOptions } from './selectors'
import { BrowseOptions, SortBy } from './types'
import { buildBrowseURL } from './utils'

beforeEach(() => {
  jest.spyOn(Date, 'now').mockReturnValue(100)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('when handling the clear filters request action', () => {
  it("should fetch assets and change the URL by clearing the filter's browse options and restarting the page counter", () => {
    const browseOptions: BrowseOptions = {
      assetType: AssetType.ITEM,
      address: '0x...',
      vendor: VendorName.DECENTRALAND,
      section: 'aSection',
      page: 1,
      view: View.MARKET,
      sortBy: SortBy.NAME,
      search: 'aText',
      onlyOnSale: true,
      isMap: false,
      isFullscreen: false,
      rarities: [Rarity.EPIC],
      wearableGenders: [WearableGender.FEMALE],
      contracts: ['aContract'],
      network: Network.ETHEREUM
    }

    const browseOptionsWithoutFilters: BrowseOptions = { ...browseOptions }
    delete browseOptionsWithoutFilters.rarities
    delete browseOptionsWithoutFilters.wearableGenders
    delete browseOptionsWithoutFilters.network
    delete browseOptionsWithoutFilters.contracts
    delete browseOptionsWithoutFilters.page

    const pathname = 'aPath'

    return expectSaga(routingSaga)
      .provide([
        [select(getCurrentBrowseOptions), browseOptions],
        [select(getLocation), { pathname }],
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

describe('when handling the fetchAssetsFromRoute request action', () => {
  it('should fetch trending items when providing the WEARABLES_TRENDING section', () => {
    const browseOptions: BrowseOptions = {
      address: '0x...',
      vendor: VendorName.DECENTRALAND,
      section: Section.WEARABLES_TRENDING
    } as BrowseOptions

    return expectSaga(routingSaga)
      .provide([[select(getCurrentBrowseOptions), browseOptions]])
      .put(fetchTrendingItemsRequest())
      .dispatch(FetchAssetsFromRouteAction(browseOptions))
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

    const filters: ItemFilters = {
      first: 24,
      skip: 0,
      sortBy: ItemSortBy.RECENTLY_REVIEWED,
      creator: address,
      category: NFTCategory.EMOTE,
      isWearableHead: false,
      isWearableAccessory: false,
      isOnSale: undefined,
      wearableCategory: undefined,
      emoteCategory: undefined,
      isWearableSmart: undefined,
      search: undefined,
      rarities: undefined,
      contractAddress: undefined,
      wearableGenders: undefined,
      emotePlayMode: undefined
    }

    return expectSaga(routingSaga)
      .provide([[call(getNewBrowseOptions, browseOptions), browseOptions]])
      .put(
        fetchItemsRequest({
          view: browseOptions.view,
          page: browseOptions.page,
          filters
        })
      )
      .dispatch(FetchAssetsFromRouteAction(browseOptions))
      .run({ silenceTimeout: true })
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
})
