import { Item, Network } from '@dcl/schemas'
import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import { ItemBrowseOptions } from '../item/types'
import { View } from '../ui/types'
import {
  cancelPickItemAsFavorite,
  fetchFavoritedItemsFailure,
  fetchFavoritedItemsRequest,
  fetchFavoritedItemsSuccess,
  FetchFavoritedItemsSuccessAction,
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
import { INITIAL_STATE, favoritesReducer } from './reducer'
import { FavoritedItemIds } from './types'

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
  network: Network.ETHEREUM
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
  it('should return a state with the loading set', () => {
    const initialState = {
      ...INITIAL_STATE,
      loading: []
    }

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
    it('should return a state with the error set and the loading state cleared', () => {
      const initialState = {
        ...INITIAL_STATE,
        error: null,
        loading: loadingReducer([], request)
      }

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
    const initialState = {
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
  const requestAction = unpickItemAsFavoriteRequest(item)
  const cancelAction = cancelPickItemAsFavorite()

  const initialState = {
    ...INITIAL_STATE,
    loading: loadingReducer([], requestAction)
  }

  it('should return a state with an empty loading state', () => {
    expect(favoritesReducer(initialState, cancelAction)).toEqual({
      ...INITIAL_STATE,
      loading: []
    })
  })
})

describe('when reducing the successful action of unpicking the item as favorite', () => {
  const requestAction = unpickItemAsFavoriteRequest(item)
  const successAction = unpickItemAsFavoriteSuccess(item)

  const initialState = {
    ...INITIAL_STATE,
    data: {
      items: {
        [item.id]: {
          pickedByUser: true,
          count: 1
        }
      },
      total: 1
    },
    loading: loadingReducer([], requestAction)
  }

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

describe('when reducing the successful action of fetching the favorited items', () => {
  const requestAction = fetchFavoritedItemsRequest(itemBrowseOptions)
  let successAction: FetchFavoritedItemsSuccessAction

  const initialState = {
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

  describe('when the item is not in the state', () => {
    const itemIdThatIsNotInTheState = '0x...-itemIdThatIsNotInTheState'
    beforeEach(() => {
      successAction = fetchFavoritedItemsSuccess(
        [{ itemId: itemIdThatIsNotInTheState }],
        1
      )
    })

    it('should return a state with the new item with count one, flagged as picked by user, and the loading state cleared', () => {
      expect(favoritesReducer(initialState, successAction)).toEqual({
        ...INITIAL_STATE,
        loading: [],
        data: {
          ...initialState.data,
          items: {
            ...initialState.data.items,
            [itemIdThatIsNotInTheState]: {
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
      successAction = fetchFavoritedItemsSuccess(itemIds, 2)
    })

    it('should return a state with the current item count increased by one, flagged as picked by user, and the loading state cleared', () => {
      expect(favoritesReducer(initialState, successAction)).toEqual({
        ...INITIAL_STATE,
        loading: [],
        data: {
          ...initialState.data,
          items: {
            ...initialState.data.items,
            [item.id]: {
              pickedByUser: true,
              count: 2
            }
          },
          total: 2
        }
      })
    })
  })
})
