import { Item, Network } from '@dcl/schemas'
import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import { ItemBrowseOptions } from '../item/types'
import { View } from '../ui/types'
import {
  CancelPickItemAsFavoriteAction,
  FetchFavoritedItemsRequestAction,
  FetchFavoritedItemsSuccessAction,
  PickItemAsFavoriteRequestAction,
  UnpickItemAsFavoriteRequestAction,
  UnpickItemAsFavoriteSuccessAction,
  cancelPickItemAsFavorite,
  fetchFavoritedItemsFailure,
  fetchFavoritedItemsRequest,
  fetchFavoritedItemsSuccess,
  pickItemAsFavoriteFailure,
  pickItemAsFavoriteRequest,
  pickItemAsFavoriteSuccess,
  undoUnpickingItemAsFavoriteFailure,
  undoUnpickingItemAsFavoriteRequest,
  undoUnpickingItemAsFavoriteSuccess,
  unpickItemAsFavoriteFailure,
  unpickItemAsFavoriteRequest,
  unpickItemAsFavoriteSuccess
} from './actions'
import { FavoritesState, INITIAL_STATE, favoritesReducer } from './reducer'
import { FavoritedItemIds } from './types'
import {
  FetchItemRequestAction,
  FetchItemSuccessAction,
  FetchItemsRequestAction,
  FetchItemsSuccessAction,
  fetchItemRequest,
  fetchItemSuccess,
  fetchItemsRequest,
  fetchItemsSuccess
} from '../item/actions'

const itemBrowseOptions: ItemBrowseOptions = {
  view: View.LISTS,
  page: 0
}

const item = {
  id: '0xContactAddress-anItemId',
  name: 'aName',
  contractAddress: '0xContactAddress',
  itemId: 'itemId ',
  price: '1500000000000000000000',
  network: Network.ETHEREUM,
  picks: {
    pickedByUser: false,
    count: 1
  }
} as Item

const itemIds: FavoritedItemIds = [{ itemId: item.id }]

const error = 'anErrorMessage'

const requestActions = [
  pickItemAsFavoriteRequest(item),
  unpickItemAsFavoriteRequest(item),
  undoUnpickingItemAsFavoriteRequest(item),
  fetchFavoritedItemsRequest(itemBrowseOptions)
]

describe.each(requestActions)('when reducing the "$type" action', action => {
  let initialState: FavoritesState

  beforeEach(() => {
    initialState = {
      ...INITIAL_STATE,
      loading: []
    }
  })

  it('should return a state with the loading set', () => {
    expect(favoritesReducer(initialState, action)).toEqual({
      ...INITIAL_STATE,
      loading: loadingReducer(initialState.loading, action)
    })
  })
})

const failureActions = [
  {
    request: pickItemAsFavoriteRequest(item),
    failure: pickItemAsFavoriteFailure(item, error)
  },
  {
    request: unpickItemAsFavoriteRequest(item),
    failure: unpickItemAsFavoriteFailure(item, error)
  },
  {
    request: undoUnpickingItemAsFavoriteRequest(item),
    failure: undoUnpickingItemAsFavoriteFailure(item, error)
  },
  {
    request: fetchFavoritedItemsRequest(itemBrowseOptions),
    failure: fetchFavoritedItemsFailure(error)
  }
]

describe.each(failureActions)(
  `when reducing the "$failure.type" action`,
  ({ request, failure }) => {
    let initialState: FavoritesState

    beforeEach(() => {
      initialState = {
        ...INITIAL_STATE,
        error: null,
        loading: loadingReducer([], request)
      }
    })

    it('should return a state with the error set and the loading state cleared', () => {
      expect(favoritesReducer(initialState, failure)).toEqual({
        ...INITIAL_STATE,
        error,
        loading: []
      })
    })
  }
)

const pickAndUndoSuccessActions = [
  {
    request: pickItemAsFavoriteRequest,
    success: pickItemAsFavoriteSuccess
  },
  {
    request: undoUnpickingItemAsFavoriteRequest,
    success: undoUnpickingItemAsFavoriteSuccess
  }
]

describe.each(pickAndUndoSuccessActions)(
  `when reducing the "$success(item).type" action`,
  ({ request, success }) => {
    let initialState: FavoritesState

    beforeEach(() => {
      initialState = {
        ...INITIAL_STATE,
        data: {
          items: {
            [item.id]: {
              pickedByUser: false,
              count: 0
            }
          },
          total: 0
        }
      }
    })

    describe('when the item is not in the state', () => {
      const anotherItem = { id: '0xContactAddress-anotherItemId' } as Item

      beforeEach(() => {
        initialState.loading = loadingReducer([], request(anotherItem))
      })

      it('should return a state with the current item count incremented by one, flagged as picked by user, and the loading state cleared', () => {
        expect(favoritesReducer(initialState, success(anotherItem))).toEqual({
          ...INITIAL_STATE,
          loading: [],
          data: {
            ...initialState.data,
            items: {
              ...initialState.data.items,
              [anotherItem.id]: {
                pickedByUser: true,
                count: 1
              }
            },
            total: 1
          }
        })
      })
    })

    describe('when the item is in the state', () => {
      beforeEach(() => {
        initialState.loading = loadingReducer([], request(item))
      })

      it('should return a state with the current item count incremented by one, flagged as picked by user, and the loading state cleared', () => {
        expect(favoritesReducer(initialState, success(item))).toEqual({
          ...INITIAL_STATE,
          loading: [],
          data: {
            ...initialState.data,
            items: {
              ...initialState.data.items,
              [item.id]: {
                pickedByUser: true,
                count: 1
              }
            },
            total: 1
          }
        })
      })
    })
  }
)

describe('when reducing the action of canceling a pick item as favorite', () => {
  let initialState: FavoritesState

  let requestAction: PickItemAsFavoriteRequestAction
  let cancelAction: CancelPickItemAsFavoriteAction

  beforeEach(() => {
    requestAction = pickItemAsFavoriteRequest(item)
    cancelAction = cancelPickItemAsFavorite()

    initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], requestAction)
    }
  })

  it('should return a state with an empty loading state', () => {
    expect(favoritesReducer(initialState, cancelAction)).toEqual({
      ...INITIAL_STATE,
      loading: []
    })
  })
})

describe('when reducing the successful action of unpicking the item as favorite', () => {
  let initialState: FavoritesState

  let requestAction: UnpickItemAsFavoriteRequestAction
  let successAction: UnpickItemAsFavoriteSuccessAction

  beforeEach(() => {
    requestAction = unpickItemAsFavoriteRequest(item)
    successAction = unpickItemAsFavoriteSuccess(item)

    initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], requestAction)
    }
  })

  describe('when the picks stats are not defined', () => {
    it('should return a state with the count in 0, flagged as non picked by user, and the loading state cleared', () => {
      expect(favoritesReducer(initialState, successAction)).toEqual({
        ...INITIAL_STATE,
        loading: [],
        data: {
          ...initialState.data,
          items: {
            [item.id]: {
              pickedByUser: false,
              count: 0
            }
          },
          total: 0
        }
      })
    })
  })

  describe('when the picks stats are defined', () => {
    beforeEach(() => {
      initialState = {
        ...initialState,
        data: {
          items: {
            [item.id]: {
              pickedByUser: true,
              count: 1
            }
          },
          total: 1
        }
      }
    })

    it('should return a state with the current item count decreased by one, flagged as non picked by user, and the loading state cleared', () => {
      expect(favoritesReducer(initialState, successAction)).toEqual({
        ...INITIAL_STATE,
        loading: [],
        data: {
          ...initialState.data,
          items: {
            ...initialState.data.items,
            [item.id]: {
              pickedByUser: false,
              count: 0
            }
          },
          total: 0
        }
      })
    })
  })
})

describe('when reducing the successful action of fetching the items', () => {
  let initialState: FavoritesState

  let requestAction: FetchItemsRequestAction
  let successAction: FetchItemsSuccessAction

  beforeEach(() => {
    requestAction = fetchItemsRequest(itemBrowseOptions)
    successAction = fetchItemsSuccess([item], 1, itemBrowseOptions, 223423423)

    initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], requestAction)
    }
  })

  it('should return a state with favorited items and their picks stats', () => {
    expect(favoritesReducer(initialState, successAction)).toEqual({
      ...initialState,
      data: {
        ...initialState.data,
        items: {
          [item.id]: {
            pickedByUser: false,
            count: 1
          }
        }
      }
    })
  })
})

describe('when reducing the successful action of fetching an item', () => {
  let initialState: FavoritesState

  let requestAction: FetchItemRequestAction
  let successAction: FetchItemSuccessAction

  beforeEach(() => {
    requestAction = fetchItemRequest(item.contractAddress, item.itemId)
    successAction = fetchItemSuccess(item)

    initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], requestAction)
    }
  })

  it('should return a state with the current item and its picks stats', () => {
    expect(favoritesReducer(initialState, successAction)).toEqual({
      ...initialState,
      data: {
        ...initialState.data,
        items: {
          [item.id]: {
            pickedByUser: false,
            count: 1
          }
        }
      }
    })
  })
})

describe('when reducing the successful action of fetching the favorited items', () => {
  let initialState: FavoritesState

  let requestAction: FetchFavoritedItemsRequestAction
  let successAction: FetchFavoritedItemsSuccessAction

  beforeEach(() => {
    requestAction = fetchFavoritedItemsRequest(itemBrowseOptions)
    successAction = fetchFavoritedItemsSuccess(itemIds, 2)

    initialState = {
      ...INITIAL_STATE,
      data: {
        items: {
          [item.id]: {
            pickedByUser: false,
            count: 1
          },
          '0x...-itemId': {
            pickedByUser: true,
            count: 10
          },
          '0x...-anotherItemId': {
            pickedByUser: false,
            count: 0
          }
        },
        total: 1
      },
      loading: loadingReducer([], requestAction)
    }
  })

  it('should return a state with the total and the loading state cleared', () => {
    expect(favoritesReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: {
        ...initialState.data,
        total: 2
      }
    })
  })
})
