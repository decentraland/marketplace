import { ChainId, Item } from '@dcl/schemas'
import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import { View } from '../ui/types'
import {
  buyItemFailure,
  buyItemRequest,
  buyItemSuccess,
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
import { INITIAL_STATE, itemReducer } from './reducer'

const itemBrowseOptions = {
  view: View.MARKET,
  page: 0
}

const item = {
  id: 'anId',
  itemId: 'anItemId',
  contractAddress: 'aContractAddress',
  price: '5000000000000000000'
} as Item

const anotherItem = {
  id: 'anotherId',
  itemId: 'anotherItemId',
  price: '1500000000000000000000'
} as Item

const chainId = ChainId.MATIC_MAINNET
const txHash = 'aTxHash'

const anErrorMessage = 'An error'

const trendingItemsBatchSize = 20

const requestActions = [
  fetchTrendingItemsRequest(trendingItemsBatchSize),
  fetchItemsRequest(itemBrowseOptions),
  fetchItemRequest(item.contractAddress, item.itemId),
  buyItemRequest(item),
  buyItemSuccess(chainId, txHash, item)
]

requestActions.forEach(action => {
  describe(`when reducing the "${action.type}" action`, () => {
    it('should return a state with the loading set', () => {
      const initialState = {
        ...INITIAL_STATE,
        loading: []
      }

      expect(itemReducer(initialState, action)).toEqual({
        ...INITIAL_STATE,
        loading: loadingReducer(initialState.loading, action)
      })
    })
  })
})

const failureActions = [
  {
    request: buyItemRequest(item),
    failure: buyItemFailure(anErrorMessage)
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
