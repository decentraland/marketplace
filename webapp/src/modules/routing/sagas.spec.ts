import { BigNumber, ethers } from 'ethers'
import { call, getContext, select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import {
  ChainId,
  EmotePlayMode,
  GenderFilterOption,
  Item,
  ItemSortBy,
  ListingStatus,
  NFTCategory,
  Network,
  Order,
  Rarity
} from '@dcl/schemas'
import { getSigner } from 'decentraland-dapps/dist/lib/eth'
import { Route } from 'decentraland-transactions/crossChain'
import { DCLRegistrar__factory } from '../../contracts/factories/DCLRegistrar__factory'
import { AssetStatusFilter } from '../../utils/filters'
import { AssetType } from '../asset/types'
import { claimNameSuccess, claimNameTransactionSubmitted } from '../ens/actions'
import { REGISTRAR_ADDRESS } from '../ens/sagas'
import { ENS } from '../ens/types'
import { getData as getEventData } from '../event/selectors'
import { fetchFavoritedItemsRequest } from '../favorites/actions'
import { buyItemCrossChainSuccess, buyItemSuccess, fetchItemsRequest, fetchTrendingItemsRequest } from '../item/actions'
import { ItemBrowseOptions } from '../item/types'
import { NFT } from '../nft/types'
import { cancelOrderSuccess, createOrderSuccess, executeOrderSuccess } from '../order/actions'
import { getPage } from '../ui/browse/selectors'
import { View } from '../ui/types'
import { VendorName } from '../vendor'
import { PAGE_SIZE } from '../vendor/api'
import { Section } from '../vendor/decentraland'
import { browse, clearFilters, fetchAssetsFromRoute as fetchAssetsFromRouteAction } from './actions'
import { locations } from './locations'
import { fetchAssetsFromRoute, getNewBrowseOptions, routingSaga } from './sagas'
import { getCurrentBrowseOptions, getSection } from './selectors'
import { BrowseOptions, SortBy } from './types'
import { buildBrowseURL } from './utils'

let pushMock: jest.Mock

beforeEach(() => {
  jest.spyOn(Date, 'now').mockReturnValue(100)
  pushMock = jest.fn()
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
          [getContext('history'), { location: { pathname }, push: pushMock }],
          [select(getEventData), {}],
          [call(fetchAssetsFromRoute, browseOptionsWithoutFilters), Promise.resolve()]
        ])
        .dispatch(clearFilters())
        .run({ silenceTimeout: true })
        .then(() => {
          expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, browseOptionsWithoutFilters))
        })
    })
  })

  describe('and the onlyOnSale filter is set to "true"', () => {
    it("should fetch assets and change the URL by clearing the filter's browse options and restarting the page counter", () => {
      return expectSaga(routingSaga)
        .provide([
          [select(getCurrentBrowseOptions), browseOptions],
          [getContext('history'), { location: { pathname }, push: pushMock }],
          [select(getEventData), {}],
          [call(fetchAssetsFromRoute, browseOptionsWithoutFilters), Promise.resolve()]
        ])
        .dispatch(clearFilters())
        .run({ silenceTimeout: true })
        .then(() => {
          expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, browseOptionsWithoutFilters))
        })
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
              [getContext('history'), { location: { pathname }, push: pushMock }],
              [select(getEventData), {}],
              [call(fetchAssetsFromRoute, browseOptionsWithoutFilters), Promise.resolve()]
            ])
            .dispatch(clearFilters())
            .run({ silenceTimeout: true })
            .then(() => {
              expect(pushMock).toHaveBeenCalledWith(
                buildBrowseURL(pathname, {
                  ...browseOptionsWithoutFilters,
                  section: Section.COLLECTIONS,
                  assetType: AssetType.NFT,
                  status: AssetStatusFilter.ON_SALE
                })
              )
            })
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
              [getContext('history'), { location: { pathname }, push: pushMock }],
              [select(getEventData), {}],
              [call(fetchAssetsFromRoute, browseOptionsWithoutFilters), Promise.resolve()]
            ])
            .dispatch(clearFilters())
            .run({ silenceTimeout: true })
            .then(() => {
              expect(pushMock).toHaveBeenCalledWith(
                buildBrowseURL(pathname, {
                  ...browseOptionsWithoutFilters,
                  section: Section.WEARABLES,
                  onlyOnSale: true,
                  assetType: AssetType.NFT
                })
              )
            })
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
        network: undefined,
        emoteHasGeometry: undefined,
        emoteHasSound: undefined
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
          network: undefined,
          emoteHasGeometry: undefined,
          emoteHasSound: undefined
        }
      }
      it('should fetch assets with the correct skip size', () => {
        return expectSaga(routingSaga)
          .provide([
            [select(getCurrentBrowseOptions), { ...browseOptions, section: Section.WEARABLES_TRENDING }],
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
            network: undefined,
            emoteHasGeometry: undefined,
            emoteHasSound: undefined
          }
        }
        it('should fetch assets with the correct skip size', () => {
          return expectSaga(routingSaga)
            .provide([
              [select(getCurrentBrowseOptions), { ...browseOptions, section: Section.WEARABLES_TRENDING }],
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
              [getContext('history'), { location: { pathname }, push: pushMock }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
            ])
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
            .then(() => {
              expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
            })
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
              [getContext('history'), { location: { pathname }, push: pushMock }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
            ])
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
            .then(() => {
              expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
            })
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
            [getContext('history'), { location: { pathname }, push: pushMock }],
            [select(getSection), Section.WEARABLES],
            [select(getEventData), {}],
            [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
          ])
          .dispatch(browse(newBrowseOptions))
          .run({ silenceTimeout: true })
          .then(() => {
            expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
          })
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
            [getContext('history'), { location: { pathname }, push: pushMock }],
            [select(getSection), Section.WEARABLES],
            [select(getEventData), {}],
            [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
          ])
          .dispatch(browse(newBrowseOptions))
          .run({ silenceTimeout: true })
          .then(() => {
            expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
          })
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
              [getContext('history'), { location: { pathname }, push: pushMock }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
            ])
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
            .then(() => {
              expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
            })
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
              [getContext('history'), { location: { pathname }, push: pushMock }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
            ])
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
            .then(() => {
              expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
            })
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
              [getContext('history'), { location: { pathname }, push: pushMock }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
            ])
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
            .then(() => {
              expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
            })
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
              [getContext('history'), { location: { pathname }, push: pushMock }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
            ])
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
            .then(() => {
              expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
            })
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
              [getContext('history'), { location: { pathname }, push: pushMock }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
            ])
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
            .then(() => {
              expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
            })
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
            [getContext('history'), { location: { pathname }, push: pushMock }],
            [select(getSection), Section.WEARABLES],
            [select(getEventData), {}],
            [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
          ])
          .dispatch(browse(newBrowseOptions))
          .run({ silenceTimeout: true })
          .then(() => {
            expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
          })
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
              [getContext('history'), { location: { pathname }, push: pushMock }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
            ])
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
            .then(() => {
              expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
            })
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
              [getContext('history'), { location: { pathname }, push: pushMock }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
            ])
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
            .then(() => {
              expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
            })
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
            [getContext('history'), { location: { pathname }, push: pushMock }],
            [select(getSection), Section.WEARABLES],
            [select(getEventData), {}],
            [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
          ])
          .dispatch(browse(newBrowseOptions))
          .run({ silenceTimeout: true })
          .then(() => {
            expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
          })
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
            [getContext('history'), { location: { pathname }, push: pushMock }],
            [select(getSection), Section.WEARABLES],
            [select(getEventData), {}],
            [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
          ])
          .dispatch(browse(newBrowseOptions))
          .run({ silenceTimeout: true })
          .then(() => {
            expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
          })
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
              [getContext('history'), { location: { pathname }, push: pushMock }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
            ])
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
            .then(() => {
              expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
            })
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
              [getContext('history'), { location: { pathname }, push: pushMock }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
            ])
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
            .then(() => {
              expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
            })
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
              [getContext('history'), { location: { pathname }, push: pushMock }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
            ])
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
            .then(() => {
              expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
            })
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
              [getContext('history'), { location: { pathname }, push: pushMock }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
            ])
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
            .then(() => {
              expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
            })
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
              [getContext('history'), { location: { pathname }, push: pushMock }],
              [select(getSection), Section.WEARABLES],
              [select(getEventData), {}],
              [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
            ])
            .dispatch(browse(newBrowseOptions))
            .run({ silenceTimeout: true })
            .then(() => {
              expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
            })
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
            [getContext('history'), { location: { pathname }, push: pushMock }],
            [select(getSection), Section.WEARABLES],
            [select(getEventData), {}],
            [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
          ])
          .dispatch(browse(newBrowseOptions))
          .run({ silenceTimeout: true })
          .then(() => {
            expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
          })
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
          [getContext('history'), { location: { pathname }, push: pushMock }],
          [select(getSection), Section.WEARABLES],
          [select(getEventData), eventContracts],
          [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
        ])
        .dispatch(browse(browseOptions))
        .run({ silenceTimeout: true })
        .then(() => {
          expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, browseOptions))
        })
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
          [getContext('history'), { location: { pathname }, push: pushMock }],
          [select(getSection), Section.WEARABLES],
          [select(getEventData), eventContracts],
          [call(fetchAssetsFromRoute, browseOptions), Promise.resolve()]
        ])
        .dispatch(browse(browseOptions))
        .run({ silenceTimeout: true })
        .then(() => {
          expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, browseOptions))
        })
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
          [getContext('history'), { location: { pathname }, push: pushMock }],
          [select(getEventData), {}],
          [call(fetchAssetsFromRoute, expectedBrowseOptions), Promise.resolve()]
        ])
        .dispatch(browse(newBrowseOptions))
        .run({ silenceTimeout: true })
        .then(() => {
          expect(pushMock).toHaveBeenCalledWith(buildBrowseURL(pathname, expectedBrowseOptions))
        })
    })
  })
})

describe('handleRedirectToSuccessPage saga', () => {
  let searchParams: {
    txHash: string
    tokenId: string
    assetType: AssetType
    contractAddress: string
    isCrossChain?: string
  }

  describe('when handling the execute order success action', () => {
    beforeEach(() => {
      searchParams = {
        txHash: 'txHash',
        tokenId: 'tokenId',
        assetType: AssetType.NFT,
        contractAddress: 'contractAddress'
      }
    })

    it('should redirect to success page with the correct query params', () => {
      return expectSaga(routingSaga)
        .provide([[getContext('history'), { push: pushMock }]])
        .dispatch(
          executeOrderSuccess(searchParams.txHash, {
            tokenId: searchParams.tokenId,
            contractAddress: searchParams.contractAddress
          } as NFT)
        )
        .run({ silenceTimeout: true })
        .then(() => {
          expect(pushMock).toHaveBeenCalledWith(locations.success(searchParams))
        })
    })
  })

  describe('when handling the buy item success action', () => {
    beforeEach(() => {
      searchParams = {
        txHash: 'txHash',
        tokenId: 'tokenId',
        assetType: AssetType.ITEM,
        contractAddress: 'contractAddress'
      }
    })

    it('should redirect to success page with the correct query params', () => {
      return expectSaga(routingSaga)
        .provide([[getContext('history'), { push: pushMock }]])
        .dispatch(
          buyItemSuccess(ChainId.ETHEREUM_GOERLI, searchParams.txHash, {
            itemId: searchParams.tokenId,
            contractAddress: searchParams.contractAddress,
            price: '10'
          } as Item)
        )
        .run({ silenceTimeout: true })
        .then(() => {
          expect(pushMock).toHaveBeenCalledWith(locations.success(searchParams))
        })
    })
  })

  describe('when handling the claim name success action', () => {
    let ens: ENS
    beforeEach(() => {
      ens = {
        subdomain: 'aSubdomain',
        tokenId: 'aTokenId',
        contractAddress: 'aContractAddress'
      } as ENS
      searchParams = {
        txHash: 'txHash',
        tokenId: ens.tokenId,
        assetType: AssetType.NFT,
        contractAddress: ens.contractAddress
      }
    })

    it('should redirect to success page with the correct query params', () => {
      return expectSaga(routingSaga)
        .provide([[getContext('history'), { push: pushMock }]])
        .dispatch(claimNameSuccess(ens, 'aName', searchParams.txHash))
        .run({ silenceTimeout: true })
        .then(() => {
          expect(pushMock).toHaveBeenCalledWith(locations.success(searchParams))
        })
    })
  })

  describe('when handling the buy item cross chain success action', () => {
    let route: Route
    let order: Order
    let item: Item
    beforeEach(() => {
      route = {
        route: {
          params: {
            fromChain: '1',
            toChain: '137'
          }
        }
      } as Route
      item = {
        id: 'anItemId',
        contractAddress: 'aContractAddress',
        itemId: 'aTokenId',
        price: '100000000'
      } as unknown as Item
    })

    describe('and its buying an existing NFT', () => {
      beforeEach(() => {
        order = {
          id: 'anOrderId',
          status: ListingStatus.OPEN,
          price: '10',
          tokenId: 'aTokenId',
          contractAddress: 'aContractAddress'
        } as Order
        searchParams = {
          txHash: 'txHash',
          tokenId: order.tokenId,
          assetType: AssetType.NFT,
          contractAddress: item.contractAddress
        }
      })

      it('should redirect to success page with the correct query params', () => {
        return expectSaga(routingSaga)
          .provide([[getContext('history'), { push: pushMock }]])
          .dispatch(buyItemCrossChainSuccess(route, ChainId.ETHEREUM_MAINNET, searchParams.txHash, item, order))
          .run({ silenceTimeout: true })
          .then(() => {
            expect(pushMock).toHaveBeenCalledWith(locations.success(searchParams))
          })
      })
    })

    describe('and its minting an NFT', () => {
      beforeEach(() => {
        searchParams = {
          txHash: 'txHash',
          tokenId: item.itemId,
          assetType: AssetType.ITEM,
          contractAddress: item.contractAddress
        }
      })

      it('should redirect to success page with the correct query params', () => {
        return expectSaga(routingSaga)
          .provide([[getContext('history'), { push: pushMock }]])
          .dispatch(buyItemCrossChainSuccess(route, ChainId.ETHEREUM_MAINNET, searchParams.txHash, item))
          .run({ silenceTimeout: true })
          .then(() => {
            expect(pushMock).toHaveBeenCalledWith(locations.success(searchParams))
          })
      })
    })
  })
})

describe.each([
  ['CREATE_ORDER_SUCCESS', createOrderSuccess, {} as NFT, 123, 123, ''],
  ['CANCEL_ORDER_SUCCESS', cancelOrderSuccess, { price: '1000000000000' } as Order, {} as NFT, '']
])('%s action', (_name, action, ...args) => {
  it('should redirect to the location when redirectTo is present', () => {
    const redirectTo = '/account?section=on_sale'
    const location = { search: `?redirectTo=${encodeURIComponent(redirectTo)}` }
    const pushMock = jest.fn()

    return (
      expectSaga(routingSaga)
        .provide([[getContext('history'), { location, push: pushMock }]])
        //@ts-ignore
        .dispatch(action(...args))
        .run()
        .then(() => {
          expect(pushMock).toHaveBeenCalledWith(redirectTo)
        })
    )
  })

  it('should redirect to the default activity location when redirectTo is not present', () => {
    const location = { search: '' }
    const pushMock = jest.fn()
    return (
      expectSaga(routingSaga)
        .provide([[getContext('history'), { location, push: pushMock }]])
        //@ts-ignore
        .dispatch(action(...args))
        .run()
        .then(() => {
          expect(pushMock).toHaveBeenCalledWith(locations.activity())
        })
    )
  })
})

describe('when handling the claim name transaction submitted action', () => {
  let subdomain: string, txHash: string, address: string
  let chainId: ChainId
  let signer: ethers.Signer
  let searchParams: {
    txHash: string
    tokenId: string
    assetType: AssetType
    contractAddress: string
    subdomain: string
  }
  let dclRegistrarContract: { address: string }
  let mockTokenId: BigNumber

  beforeEach(() => {
    subdomain = 'aSubdomain'
    txHash = 'txHash'
    address = 'address'
    dclRegistrarContract = { address: '0xAnAddress' }
    searchParams = {
      txHash,
      assetType: AssetType.NFT,
      tokenId: '',
      contractAddress: dclRegistrarContract.address,
      subdomain
    }
    signer = {} as ethers.Signer
    mockTokenId = BigNumber.from(1)
  })

  it('should redirect to success page with the correct query params', () => {
    const pushMock = jest.fn()
    return expectSaga(routingSaga)
      .provide([
        [getContext('history'), { push: pushMock }],
        [call(getSigner), {}],
        [
          call([DCLRegistrar__factory, 'connect'], REGISTRAR_ADDRESS, signer),
          {
            ...dclRegistrarContract,
            getTokenId: () => mockTokenId
          }
        ]
      ])
      .dispatch(claimNameTransactionSubmitted(subdomain, address, chainId, txHash))
      .run({ silenceTimeout: true })
      .then(() => {
        expect(pushMock).toHaveBeenCalledWith(locations.success(searchParams))
      })
  })
})
