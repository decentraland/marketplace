import { Network, Rarity } from '@dcl/schemas'
import { getLocation, push } from 'connected-react-router'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga/effects'
import { AssetType } from '../asset/types'
import { WearableGender } from '../nft/wearable/types'
import { View } from '../ui/types'
import { VendorName } from '../vendor'
import { clearFilters } from './actions'
import {
  buildBrowseURL,
  fetchAssetsFromRoute,
  getCurrentBrowseOptions,
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
