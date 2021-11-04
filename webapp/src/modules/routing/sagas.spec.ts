import { Network, Rarity } from '@dcl/schemas'
import { getLocation, push } from 'connected-react-router'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select, fork } from 'redux-saga/effects'
import { AssetType } from '../asset/types'
import { fetchItemsRequest } from '../item/actions'
import { fetchNFTsRequest } from '../nft/actions'
import { WearableGender } from '../nft/wearable/types'
import { View } from '../ui/types'
import { VendorName } from '../vendor'
import { MAX_QUERY_SIZE } from '../vendor/api'
import { Section } from '../vendor/decentraland'
import { getAddress } from '../wallet/selectors'
import { browse, clearFilters } from './actions'
import {
  buildBrowseURL,
  fetchAssetsFromRoute,
  getCurrentBrowseOptions,
  getNewBrowseOptions,
  handleBrowse,
  handleOnSaleBrowse,
  routingSaga
} from './sagas'
import { BrowseOptions, SortBy } from './types'

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
      wearableRarities: [Rarity.EPIC],
      wearableGenders: [WearableGender.FEMALE],
      contracts: ['aContract'],
      network: Network.ETHEREUM
    }

    const browseOptionsWithoutFilters: BrowseOptions = { ...browseOptions }
    delete browseOptionsWithoutFilters.wearableRarities
    delete browseOptionsWithoutFilters.wearableGenders
    delete browseOptionsWithoutFilters.network
    delete browseOptionsWithoutFilters.contracts
    delete browseOptionsWithoutFilters.page

    const pathname = 'aPath'

    return expectSaga(routingSaga)
      .provide([
        [call(getCurrentBrowseOptions), browseOptions],
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

describe('when handling browse', () => {
  describe('when section is on sale', () => {
    it('should fork to handle on sale browse', () => {
      const sampleAction = browse({})
      const samplePathname = 'some-path'
      const sampleOptions = { section: Section.ON_SALE }

      return expectSaga(handleBrowse as any, sampleAction)
        .provide([
          [call(getNewBrowseOptions, {}), sampleOptions],
          [select(getLocation), { pathname: samplePathname }],
          [fork(handleOnSaleBrowse, sampleOptions), {}]
        ])
        .fork(handleOnSaleBrowse, sampleOptions)
        .put(push(buildBrowseURL(samplePathname, sampleOptions)))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the on sale browse', () => {
  it('should put both fetch items and fetch nfts actions', () => {
    const sampleAddress = 'some-address'
    const sampleView = View.CURRENT_ACCOUNT

    return expectSaga(handleOnSaleBrowse, { view: sampleView })
      .provide([[select(getAddress), sampleAddress]])
      .put(
        fetchItemsRequest({
          filters: { creator: sampleAddress, isOnSale: true }
        })
      )
      .put(
        fetchNFTsRequest({
          view: sampleView,
          vendor: VendorName.DECENTRALAND,
          params: {
            first: MAX_QUERY_SIZE,
            skip: 0,
            onlyOnSale: true,
            address: sampleAddress
          }
        })
      )
      .run({ silenceTimeout: true })
  })
})
