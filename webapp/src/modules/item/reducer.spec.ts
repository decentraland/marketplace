import { ChainId, Item, Network } from '@dcl/schemas'
import { TradeType } from 'decentraland-dapps/dist/modules/gateway/transak/types'
import { NFTPurchase, PurchaseStatus } from 'decentraland-dapps/dist/modules/gateway/types'
import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import { NetworkGatewayType } from 'decentraland-ui'
import {
  FETCH_FAVORITED_ITEMS_SUCCESS,
  FETCH_LISTS_SUCCESS,
  GET_LIST_SUCCESS,
  fetchFavoritedItemsRequest,
  fetchFavoritedItemsSuccess,
  fetchListsRequest,
  fetchListsSuccess,
  getListRequest,
  getListSuccess
} from '../favorites/actions'
import { ListsBrowseOptions } from '../favorites/types'
import { View } from '../ui/types'
import { ListDetails, Permission } from '../vendor/decentraland/favorites'
import {
  buyItemFailure,
  buyItemRequest,
  buyItemSuccess,
  buyItemWithCardFailure,
  buyItemWithCardRequest,
  buyItemWithCardSuccess,
  clearItemErrors,
  FETCH_COLLECTION_ITEMS_SUCCESS,
  FETCH_ITEM_SUCCESS,
  FETCH_TRENDING_ITEMS_SUCCESS,
  fetchCollectionItemsFailure,
  fetchCollectionItemsRequest,
  fetchCollectionItemsSuccess,
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
import { INITIAL_STATE, ItemState, itemReducer } from './reducer'

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

const purchase: NFTPurchase = {
  address: 'anAddress',
  id: 'anId',
  network: Network.ETHEREUM,
  timestamp: 1671028355396,
  status: PurchaseStatus.PENDING,
  gateway: NetworkGatewayType.TRANSAK,
  txHash: 'mock-transaction-hash',
  nft: {
    contractAddress: 'contractAddress',
    itemId: 'anId',
    tokenId: undefined,
    tradeType: TradeType.PRIMARY,
    cryptoAmount: 10
  },
  paymentMethod: 'credit-card'
}

const chainId = ChainId.MATIC_MAINNET
const txHash = 'aTxHash'

const anErrorMessage = 'An error'

const trendingItemsBatchSize = 20

const listsBrowseOptions: ListsBrowseOptions = {
  page: 1,
  first: 10
}

const list: ListDetails = {
  id: 'aListId',
  name: 'aName',
  description: 'aDescription',
  userAddress: 'anAddress',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  itemsCount: 1,
  permission: Permission.EDIT,
  isPrivate: true,
  previewOfItemIds: [item.id]
}

const requestActions = [
  fetchTrendingItemsRequest(trendingItemsBatchSize),
  fetchItemsRequest(itemBrowseOptions),
  fetchCollectionItemsRequest({ contractAddresses: [], first: 10 }),
  fetchItemRequest(item.contractAddress, item.itemId),
  buyItemRequest(item),
  buyItemWithCardRequest(item),
  buyItemSuccess(chainId, txHash, item),
  buyItemWithCardSuccess(chainId, txHash, item, purchase)
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
    request: buyItemWithCardRequest(item),
    failure: buyItemWithCardFailure(anErrorMessage)
  },
  {
    request: fetchItemsRequest(itemBrowseOptions),
    failure: fetchItemsFailure(anErrorMessage, itemBrowseOptions)
  },
  {
    request: fetchCollectionItemsRequest({ contractAddresses: [], first: 10 }),
    failure: fetchCollectionItemsFailure(anErrorMessage)
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
  let successAction = fetchItemsSuccess([item], 1, itemBrowseOptions, 223423423)

  let initialState = {
    ...INITIAL_STATE,
    data: { anotherId: anotherItem },
    loading: loadingReducer([], requestAction)
  }

  describe('and the fetched items are not in the state', () => {
    it('should return a state with the loaded items and the loading state cleared', () => {
      expect(itemReducer(initialState, successAction)).toEqual({
        ...INITIAL_STATE,
        loading: [],
        data: { ...initialState.data, [item.id]: item }
      })
    })
  })

  describe('and the fetched items are in the state', () => {
    let newItemData: Item
    beforeEach(() => {
      newItemData = {
        minPrice: '1234'
      } as Item
      successAction = fetchItemsSuccess([{ ...item, ...newItemData }], 1, itemBrowseOptions, 223423423)
      initialState = {
        ...INITIAL_STATE,
        data: { anotherId: anotherItem, [item.id]: item },
        loading: loadingReducer([], requestAction)
      }
    })
    it('should return a state with the old items merged with the new fetched items and the loading state cleared', () => {
      expect(itemReducer(initialState, successAction)).toEqual({
        ...INITIAL_STATE,
        loading: [],
        data: { ...initialState.data, [item.id]: { ...item, ...newItemData } }
      })
    })
  })
})

describe.each([
  [FETCH_COLLECTION_ITEMS_SUCCESS, fetchCollectionItemsRequest({ contractAddresses: [], first: 10 }), fetchCollectionItemsSuccess([item])],
  [GET_LIST_SUCCESS, getListRequest(item.id), getListSuccess(list, [item])],
  [FETCH_LISTS_SUCCESS, fetchListsRequest(listsBrowseOptions), fetchListsSuccess([list], [item], 1, listsBrowseOptions)],
  [FETCH_ITEM_SUCCESS, fetchItemRequest(item.contractAddress, item.itemId), fetchItemSuccess(item)],
  [FETCH_TRENDING_ITEMS_SUCCESS, fetchTrendingItemsRequest(trendingItemsBatchSize), fetchTrendingItemsSuccess([item])],
  [
    FETCH_FAVORITED_ITEMS_SUCCESS,
    fetchFavoritedItemsRequest({}),
    fetchFavoritedItemsSuccess([item], { [item.id]: Date.now() }, 1, {}, Date.now())
  ]
])('when reducing the %s action', (_action, requestAction, successAction) => {
  const initialState = {
    ...INITIAL_STATE,
    data: { anotherId: anotherItem },
    loading: loadingReducer([], requestAction)
  }

  it('should return a state with the loaded items with the fetched item and the loading state cleared', () => {
    expect(itemReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: { ...initialState.data, [item.id]: item }
    })
  })
})

describe('when reducing the successful action of fetching an item', () => {
  const requestAction = fetchItemRequest(item.contractAddress, item.itemId)
  let successAction = fetchItemSuccess(item)

  let initialState = {
    ...INITIAL_STATE,
    data: { anotherId: anotherItem },
    loading: loadingReducer([], requestAction)
  }

  describe('and the fetched item is not in the state', () => {
    it('should return a state with the loaded items, the fetched item and the loading state cleared', () => {
      expect(itemReducer(initialState, successAction)).toEqual({
        ...INITIAL_STATE,
        loading: [],
        data: { ...initialState.data, [item.id]: item }
      })
    })
  })

  describe('and the item is already in the state', () => {
    let newItemData: Item
    beforeEach(() => {
      newItemData = {
        minPrice: '1234'
      } as Item
      initialState = {
        ...INITIAL_STATE,
        data: { anotherId: anotherItem, [item.id]: item },
        loading: loadingReducer([], requestAction)
      }
      successAction = fetchItemSuccess({ ...item, ...newItemData })
    })
    it('should return a state containing the old items merged with the new fetched item and the loading state cleared', () => {
      expect(itemReducer(initialState, successAction)).toEqual({
        ...INITIAL_STATE,
        loading: [],
        data: { ...initialState.data, [item.id]: { ...item, ...newItemData } }
      })
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

  it('should return a state with the loaded items plus the fetched trending items and the loading state cleared', () => {
    expect(itemReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: { ...initialState.data, [item.id]: item }
    })
  })
})

describe('when reducing a clear item errors action', () => {
  let state: ItemState

  beforeEach(() => {
    state = {
      ...INITIAL_STATE,
      error: 'Some test error'
    }
  })

  it('should set the error field as null', () => {
    expect(itemReducer(state, clearItemErrors())).toEqual(expect.objectContaining({ error: null }))
  })
})
