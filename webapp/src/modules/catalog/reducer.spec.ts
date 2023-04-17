import { ChainId, Item, Network } from '@dcl/schemas'
import { TradeType } from 'decentraland-dapps/dist/modules/gateway/transak/types'
import {
  NFTPurchase,
  PurchaseStatus
} from 'decentraland-dapps/dist/modules/gateway/types'
import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import { NetworkGatewayType } from 'decentraland-ui'
import { View } from '../ui/types'
import {
  buyItemFailure,
  buyItemRequest,
  buyItemSuccess,
  buyItemWithCardFailure,
  buyItemWithCardRequest,
  buyItemWithCardSuccess,
  fetchItemFailure,
  fetchItemRequest,
  fetchItemsFailure,
  fetchItemsRequest,
  fetchItemsSuccess,
  fetchItemSuccess,
  fetchTrendingItemsFailure,
  fetchTrendingItemsRequest,
  fetchTrendingItemsSuccess
} from './actions'
import { INITIAL_STATE, catalogItemReducer } from './reducer'
import { CatalogFilters, CatalogItem } from './types'

const catalogFilters: CatalogFilters = {}

const item = {
  id: 'anId',
  contractAddress: 'aContractAddress',
  price: '5000000000000000000',
  listings: 4,
  minListingPrice: '1500000000000000000000',
  maxListingPrice: '5000000000000000000000'
} as CatalogItem

const anotherItem = {
  id: 'anotherId',
  contractAddress: 'aContractAddress',
  price: '5000000000000000000',
  listings: 4,
  minListingPrice: '1500000000000000000000',
  maxListingPrice: '5000000000000000000000'
} as CatalogItem

const anErrorMessage = 'An error'

const trendingItemsBatchSize = 20

describe(`when reducing the "${fetchItemsRequest.type}" action`, () => {
  it('should return a state with the loading set', () => {
    const initialState = {
      ...INITIAL_STATE,
      loading: []
    }

    expect(
      catalogItemReducer(initialState, fetchItemsRequest(catalogFilters))
    ).toEqual({
      ...INITIAL_STATE,
      loading: loadingReducer(
        initialState.loading,
        fetchItemsRequest(catalogFilters)
      )
    })
  })
})

const failureActions = [
  {
    request: buyItemRequest(item),
    failure: buyItemFailure(anErrorMessage)
  },
  {
    request: buyItemWithCardRequest(item),
    failure: buyItemWithCardFailure(anErrorMessage)
  },
  {
    request: fetchItemsRequest(itemBrowseOptions),
    failure: fetchItemsFailure(anErrorMessage, itemBrowseOptions)
  },
  {
    request: fetchItemRequest(item.contractAddress, item.itemId),
    failure: fetchItemFailure(item.contractAddress, item.itemId, anErrorMessage)
  },
  {
    request: fetchTrendingItemsRequest(trendingItemsBatchSize),
    failure: fetchTrendingItemsFailure(anErrorMessage)
  }
]

failureActions.forEach(action => {
  describe(`when reducing the "${action.failure.type}" action`, () => {
    it('should return a state with the error set and the loading state cleared', () => {
      const initialState = {
        ...INITIAL_STATE,
        error: null,
        loading: loadingReducer([], action.request)
      }

      expect(itemReducer(initialState, action.failure)).toEqual({
        ...INITIAL_STATE,
        error: anErrorMessage,
        loading: []
      })
    })
  })
})

describe('when reducing the successful action of fetching items', () => {
  const requestAction = fetchItemsRequest(itemBrowseOptions)
  const successAction = fetchItemsSuccess(
    [item],
    1,
    itemBrowseOptions,
    223423423
  )

  const initialState = {
    ...INITIAL_STATE,
    data: { anotherId: anotherItem },
    loading: loadingReducer([], requestAction)
  }

  it('should return a state with the the loaded items and the loading state cleared', () => {
    expect(itemReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: { ...initialState.data, [item.id]: item }
    })
  })
})

describe('when reducing the successful action of fetching an item', () => {
  const requestAction = fetchItemRequest(item.contractAddress, item.itemId)
  const successAction = fetchItemSuccess(item)

  const initialState = {
    ...INITIAL_STATE,
    data: { anotherId: anotherItem },
    loading: loadingReducer([], requestAction)
  }

  it('should return a state with the the loaded items plus the fetched item and the loading state cleared', () => {
    expect(itemReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: { ...initialState.data, [item.id]: item }
    })
  })
})

describe('when reducing the successful action of fetching trending items', () => {
  const requestAction = fetchTrendingItemsRequest(trendingItemsBatchSize)
  const successAction = fetchTrendingItemsSuccess([item])

  const initialState = {
    ...INITIAL_STATE,
    data: { anotherId: anotherItem },
    loading: loadingReducer([], requestAction)
  }

  it('should return a state with the the loaded items plus the fetched trending items and the loading state cleared', () => {
    expect(itemReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: { ...initialState.data, [item.id]: item }
    })
  })
})
