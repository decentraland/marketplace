import { Item, Network } from '@dcl/schemas'
import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import { ItemBrowseOptions } from '../item/types'
import { View } from '../ui/types'
import { fetchItemSuccess, fetchItemsSuccess } from '../item/actions'
import {
  CancelPickItemAsFavoriteAction,
  DeleteListRequestAction,
  DeleteListSuccessAction,
  FetchFavoritedItemsRequestAction,
  FetchFavoritedItemsSuccessAction,
  FetchListsRequestAction,
  FetchListsSuccessAction,
  GetListRequestAction,
  GetListSuccessAction,
  PickItemAsFavoriteRequestAction,
  UnpickItemAsFavoriteRequestAction,
  UnpickItemAsFavoriteSuccessAction,
  cancelPickItemAsFavorite,
  deleteListFailure,
  deleteListRequest,
  deleteListSuccess,
  fetchFavoritedItemsFailure,
  fetchFavoritedItemsRequest,
  fetchFavoritedItemsSuccess,
  fetchListsFailure,
  fetchListsRequest,
  fetchListsSuccess,
  getListFailure,
  getListRequest,
  getListSuccess,
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
import { List } from './types'

let createdAt: Record<string, number>
let initialState: FavoritesState
const itemBrowseOptions: ItemBrowseOptions = {
  view: View.LISTS,
  page: 0
}

const item: Item = {
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

const actionList: List = {
  id: 'aListId',
  name: 'aName',
  description: 'aDescription',
  userAddress: 'anAddress',
  createdAt: Date.now()
}

const error = 'anErrorMessage'

const requestActions = [
  deleteListRequest(actionList),
  pickItemAsFavoriteRequest(item),
  unpickItemAsFavoriteRequest(item),
  undoUnpickingItemAsFavoriteRequest(item),
  fetchFavoritedItemsRequest(itemBrowseOptions),
  fetchListsRequest(itemBrowseOptions),
  getListRequest(actionList.id)
]

beforeEach(() => {
  createdAt = {
    [item.id]: Date.now(),
    'some-other-id': Date.now()
  }
  initialState = {
    ...INITIAL_STATE
  }
})

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
  },
  {
    request: fetchListsRequest(itemBrowseOptions),
    failure: fetchListsFailure(error)
  },
  {
    request: deleteListRequest(actionList),
    failure: deleteListFailure(error)
  },
  {
    request: getListRequest(actionList.id),
    failure: getListFailure(actionList.id, error)
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
          lists: {},
          items: {
            [item.id]: {
              pickedByUser: false,
              count: 0
            }
          }
        }
      }
    })

    describe('when the item is not in the state', () => {
      let anotherItem: Item
      let currentDate: number

      beforeEach(() => {
        currentDate = Date.now()
        jest.spyOn(Date, 'now').mockReturnValueOnce(currentDate)
        anotherItem = { id: '0xContactAddress-anotherItemId' } as Item
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
                count: 1,
                createdAt: currentDate
              }
            }
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
            }
          }
        })
      })
    })
  }
)

describe('when reducing the action of canceling a pick item as favorite', () => {
  let requestAction: PickItemAsFavoriteRequestAction
  let cancelAction: CancelPickItemAsFavoriteAction

  beforeEach(() => {
    requestAction = pickItemAsFavoriteRequest(item)
    cancelAction = cancelPickItemAsFavorite()

    initialState = {
      ...initialState,
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
  let requestAction: UnpickItemAsFavoriteRequestAction
  let successAction: UnpickItemAsFavoriteSuccessAction

  beforeEach(() => {
    requestAction = unpickItemAsFavoriteRequest(item)
    successAction = unpickItemAsFavoriteSuccess(item)

    initialState = {
      ...initialState,
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
          }
        }
      })
    })
  })

  describe('when the picks stats are defined', () => {
    beforeEach(() => {
      initialState = {
        ...initialState,
        data: {
          ...initialState.data,
          items: {
            [item.id]: {
              pickedByUser: true,
              count: 1
            }
          }
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
          }
        }
      })
    })
  })
})

describe('when reducing the successful action of fetching an item', () => {
  it('should return a state with the current item and its picks stats', () => {
    expect(favoritesReducer(initialState, fetchItemSuccess(item))).toEqual({
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

describe('when reducing the successful action of fetching items', () => {
  it('should return a state with the  picks stats', () => {
    expect(
      favoritesReducer(
        initialState,
        fetchItemsSuccess([item], 1, {}, Date.now())
      )
    ).toEqual({
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
  let requestAction: FetchFavoritedItemsRequestAction
  let successAction: FetchFavoritedItemsSuccessAction
  let total: number

  beforeEach(() => {
    total = 2
    requestAction = fetchFavoritedItemsRequest(itemBrowseOptions)
    successAction = fetchFavoritedItemsSuccess(
      [{ ...item, picks: { pickedByUser: true, count: 2 } }],
      createdAt,
      total,
      {},
      Date.now()
    )

    initialState = {
      ...initialState,
      data: {
        ...initialState.data,
        items: {
          [item.id]: {
            pickedByUser: false,
            count: 1,
            createdAt: undefined
          },
          '0x...-itemId': {
            pickedByUser: true,
            count: 10
          },
          '0x...-anotherItemId': {
            pickedByUser: false,
            count: 0
          },
          'some-other-id': {
            count: 0,
            createdAt: undefined
          }
        }
      },
      loading: loadingReducer([], requestAction)
    }
  })

  it('should return a state with the loading state cleared with the createdAt property set for the favorited items', () => {
    expect(favoritesReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: {
        ...initialState.data,
        items: {
          ...initialState.data.items,
          [item.id]: {
            pickedByUser: true,
            count: 2,
            createdAt: createdAt[item.id]
          }
        }
      }
    })
  })
})

describe('when reducing the successful action of fetching lists', () => {
  let requestAction: FetchListsRequestAction
  let successAction: FetchListsSuccessAction
  let newList: List
  let total: number

  beforeEach(() => {
    newList = {
      id: 'aListId',
      name: 'aName',
      description: 'aDescription',
      userAddress: 'anAddress',
      createdAt: Date.now()
    }
    total = 2
    requestAction = fetchListsRequest(itemBrowseOptions)
    successAction = fetchListsSuccess([newList], total, {})

    initialState = {
      ...initialState,
      data: {
        ...initialState.data,
        lists: {
          anotherList: {
            id: 'anId',
            name: 'aName',
            description: 'aDescription',
            userAddress: 'anAddress',
            createdAt: Date.now()
          }
        }
      },
      loading: loadingReducer([], requestAction)
    }
  })

  it('should return a state with the old and the new lists', () => {
    expect(favoritesReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: {
        ...initialState.data,
        lists: {
          ...initialState.data.lists,
          [newList.id]: newList
        }
      }
    })
  })
})

describe('when reducing the successful action of deleting a list', () => {
  let requestAction: DeleteListRequestAction
  let successAction: DeleteListSuccessAction
  let list: List

  beforeEach(() => {
    list = {
      id: 'aListId',
      name: 'aName',
      description: 'aDescription',
      userAddress: 'anAddress',
      createdAt: Date.now()
    }
    requestAction = deleteListRequest(list)
    successAction = deleteListSuccess(list)
    initialState = {
      ...initialState,
      data: {
        ...initialState.data,
        lists: {
          anId: {
            id: 'anId',
            name: 'aName',
            description: 'aDescription',
            userAddress: 'anAddress',
            createdAt: Date.now()
          },
          [list.id]: list
        }
      },
      loading: loadingReducer([], requestAction)
    }
  })

  it('should return a state without the deleted list and the loading state cleared', () => {
    expect(favoritesReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: {
        ...initialState.data,
        lists: {
          [initialState.data.lists['anId'].id]: initialState.data.lists['anId']
        }
      }
    })
  })
})

describe('when reducing the successful action of getting a list', () => {
  let requestAction: GetListRequestAction
  let successAction: GetListSuccessAction
  let list: List

  beforeEach(() => {
    list = {
      id: 'aListId',
      name: 'aName',
      description: 'aDescription',
      userAddress: 'anAddress',
      createdAt: Date.now()
    }
    requestAction = getListRequest(list.id)
    successAction = getListSuccess(list)
    initialState = {
      ...initialState,
      loading: loadingReducer([], requestAction)
    }
  })

  it('should return a state with the the new list and the loading state cleared', () => {
    expect(favoritesReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: {
        ...initialState.data,
        lists: {
          [list.id]: list
        }
      }
    })
  })
})
