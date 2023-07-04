import { Item, Network } from '@dcl/schemas'
import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import { ItemBrowseOptions } from '../item/types'
import { View } from '../ui/types'
import {
  ListDetails,
  ListOfLists,
  Permission,
  UpdateOrCreateList
} from '../vendor/decentraland/favorites/types'
import { fetchItemSuccess, fetchItemsSuccess } from '../item/actions'
import {
  BulkPickUnpickCancelAction,
  BulkPickUnpickStartAction,
  CreateListClearAction,
  CreateListRequestAction,
  CreateListSuccessAction,
  DeleteListRequestAction,
  DeleteListSuccessAction,
  FetchFavoritedItemsRequestAction,
  FetchFavoritedItemsSuccessAction,
  FetchListsRequestAction,
  FetchListsSuccessAction,
  GetListRequestAction,
  GetListSuccessAction,
  UpdateListRequestAction,
  UpdateListSuccessAction,
  bulkPickUnpickCancel,
  bulkPickUnpickFailure,
  bulkPickUnpickRequest,
  bulkPickUnpickStart,
  bulkPickUnpickSuccess,
  createListClear,
  createListFailure,
  createListRequest,
  createListSuccess,
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
  updateListFailure,
  updateListRequest,
  updateListSuccess
} from './actions'
import { FavoritesState, INITIAL_STATE, favoritesReducer } from './reducer'
import { CreateListParameters, List, ListsBrowseOptions } from './types'

let createdAt: Record<string, number>
let initialState: FavoritesState
const itemBrowseOptions: ItemBrowseOptions = {
  view: View.LISTS,
  page: 0
}

const listsBrowseOptions: ListsBrowseOptions = {
  page: 1,
  first: 10
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
  createdAt: Date.now(),
  itemsCount: 1
}

const listOfLists: ListOfLists = {
  id: 'aListId',
  name: 'aName',
  itemsCount: 1,
  isPrivate: true,
  previewOfItemIds: []
}

const createOrUpdateList: CreateListParameters = {
  name: 'aName',
  description: 'aDescription',
  isPrivate: true
}

const error = 'anErrorMessage'

const requestActions = [
  bulkPickUnpickStart(item),
  bulkPickUnpickRequest(item, [listOfLists], []),
  deleteListRequest(actionList),
  fetchFavoritedItemsRequest(itemBrowseOptions),
  fetchListsRequest(listsBrowseOptions),
  getListRequest(actionList.id),
  updateListRequest(actionList.id, createOrUpdateList),
  createListRequest({
    name: 'aListName',
    isPrivate: true,
    description: 'aDescription'
  })
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
    request: fetchFavoritedItemsRequest(itemBrowseOptions),
    failure: fetchFavoritedItemsFailure(error)
  },
  {
    request: fetchListsRequest(listsBrowseOptions),
    failure: fetchListsFailure(error)
  },
  {
    request: deleteListRequest(actionList),
    failure: deleteListFailure({ id: 'aListId' } as List, error)
  },
  {
    request: getListRequest(actionList.id),
    failure: getListFailure(actionList.id, error)
  },
  {
    request: updateListRequest(actionList.id, createOrUpdateList),
    failure: updateListFailure(actionList.id, error)
  },
  {
    request: createListRequest({
      name: 'aListName',
      isPrivate: true,
      description: 'aDescription'
    }),
    failure: createListFailure(error)
  },
  {
    request: bulkPickUnpickRequest(item, [listOfLists], []),
    failure: bulkPickUnpickFailure(item, [listOfLists], [], error)
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

describe('when reducing the action of canceling a bulk pick/unpick item process', () => {
  let requestAction: BulkPickUnpickStartAction
  let cancelAction: BulkPickUnpickCancelAction

  describe('when it is canceled without an error', () => {
    beforeEach(() => {
      requestAction = bulkPickUnpickStart(item)
      cancelAction = bulkPickUnpickCancel(item)

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

  describe('when it is canceled with an error', () => {
    const error = 'an error'

    beforeEach(() => {
      requestAction = bulkPickUnpickStart(item)
      cancelAction = bulkPickUnpickCancel(item, error)

      initialState = {
        ...initialState,
        loading: loadingReducer([], requestAction)
      }
    })

    it('should return a state with an empty loading state and the error', () => {
      expect(favoritesReducer(initialState, cancelAction)).toEqual({
        ...INITIAL_STATE,
        loading: [],
        error
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
  let newList: ListOfLists
  let total: number

  beforeEach(() => {
    newList = {
      id: 'aListId',
      name: 'aName',
      itemsCount: 1,
      previewOfItemIds: [item.id],
      isPrivate: true
    }
    total = 2
    requestAction = fetchListsRequest(listsBrowseOptions)
    successAction = fetchListsSuccess(
      [newList],
      [item],
      total,
      listsBrowseOptions
    )

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
            createdAt: Date.now(),
            updatedAt: null,
            itemsCount: 1
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
      itemsCount: 1,
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
            itemsCount: 1,
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
  let list: ListDetails

  beforeEach(() => {
    list = {
      id: 'aListId',
      name: 'aName',
      description: 'aDescription',
      userAddress: 'anAddress',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      itemsCount: 1,
      permission: Permission.EDIT,
      isPrivate: true,
      previewOfItemIds: []
    }
    requestAction = getListRequest(list.id)
    successAction = getListSuccess(list, [])
    initialState = {
      ...initialState,
      loading: loadingReducer([], requestAction)
    }
  })

  describe('and the list already exists in the state', () => {
    beforeEach(() => {
      initialState = {
        ...initialState,
        data: {
          ...initialState.data,
          lists: {
            [list.id]: {
              id: list.id,
              name: 'anotherName',
              description: 'anotherDescription',
              userAddress: 'anotherAddress',
              createdAt: 1,
              updatedAt: 2,
              itemsCount: 3,
              permission: Permission.VIEW,
              isPrivate: false
            }
          }
        },
        loading: loadingReducer([], requestAction)
      }
    })

    it('should return an state with the the new list overwriting the old one and the loading state cleared', () => {
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

  describe("and the list doesn't exist in the state", () => {
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

describe('when reducing the successful action of updating a list', () => {
  let requestAction: UpdateListRequestAction
  let successAction: UpdateListSuccessAction
  let list: List
  let updatedList: UpdateOrCreateList
  let updatedListParameters: Partial<CreateListParameters>

  beforeEach(() => {
    list = {
      id: 'aListId',
      name: 'oldName',
      description: 'aDescription',
      userAddress: 'anAddress',
      createdAt: Date.now(),
      itemsCount: 1,
      isPrivate: false
    }
    updatedListParameters = {
      name: 'newName',
      description: 'aDescription'
    }
    updatedList = {
      id: 'aListId',
      name: 'newName',
      description: 'aDescription',
      userAddress: 'anAddress',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      permission: Permission.EDIT,
      isPrivate: true,
      previewOfItemIds: []
    }
    requestAction = updateListRequest(list.id, updatedListParameters)
    successAction = updateListSuccess(updatedList)
    initialState = {
      ...initialState,
      data: {
        ...initialState.data,
        lists: {
          ...initialState.data.lists,
          [list.id]: list
        }
      },
      loading: loadingReducer([], requestAction)
    }
  })

  it('should return a state with the the updated list and the loading state cleared', () => {
    expect(favoritesReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: {
        ...initialState.data,
        lists: {
          [list.id]: { ...list, ...updatedList }
        }
      }
    })
  })
})

describe('when reducing the successful action of creating a list', () => {
  let requestAction: CreateListRequestAction
  let successAction: CreateListSuccessAction
  let createdList: UpdateOrCreateList
  let createListParameters: CreateListParameters

  beforeEach(() => {
    createdList = {
      id: 'aListId',
      name: 'newName',
      description: 'aDescription',
      userAddress: 'anAddress',
      createdAt: Date.now(),
      updatedAt: null,
      permission: null,
      isPrivate: true,
      previewOfItemIds: []
    }
    createListParameters = {
      name: createdList.name,
      description: createdList.description ?? '',
      isPrivate: createdList.isPrivate
    }
    requestAction = createListRequest(createListParameters)
    successAction = createListSuccess(createdList)
    initialState = {
      ...initialState,
      loading: loadingReducer([], requestAction)
    }
  })

  it('should return a state with the the updated list and the loading state cleared', () => {
    expect(favoritesReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: {
        ...initialState.data,
        lists: {
          [createdList.id]: { ...createdList, itemsCount: 0 }
        }
      }
    })
  })
})

describe('when reducing the clear action of creating a list', () => {
  let clearAction: CreateListClearAction
  let requestAction: CreateListRequestAction
  let list: CreateListParameters

  beforeEach(() => {
    list = {
      name: 'newName',
      description: 'aDescription',
      isPrivate: true
    }
    requestAction = createListRequest({
      name: list.name,
      isPrivate: true,
      description: list.description
    })
    clearAction = createListClear()
    initialState = {
      ...initialState,
      loading: loadingReducer([], requestAction),
      error: 'An error'
    }
  })

  it('should return a state with the the updated list and the loading state cleared', () => {
    expect(favoritesReducer(initialState, clearAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      error: null
    })
  })
})

describe('when reducing the successful action of bulk picking and unpicking', () => {
  let ownerRemovedFromCurrentList: boolean

  beforeEach(() => {
    initialState = {
      ...initialState,
      loading: [bulkPickUnpickRequest(item, [listOfLists], [])]
    }
  })

  describe('and the item was removed by the owner from the current lists', () => {
    beforeEach(() => {
      ownerRemovedFromCurrentList = true
    })

    describe("and the item was picked before and now isn't", () => {
      beforeEach(() => {
        initialState = {
          ...initialState,
          data: {
            ...initialState.data,
            items: {
              ...initialState.data.items,
              [item.id]: {
                pickedByUser: true,
                count: 1,
                createdAt: Date.now()
              }
            }
          }
        }
      })

      it('should return a state where the item is flagged as not picked by the user, the created date set as undefined, the counter decreased and the loading state cleared', () => {
        expect(
          favoritesReducer(
            initialState,
            bulkPickUnpickSuccess(
              item,
              [listOfLists],
              [],
              false,
              ownerRemovedFromCurrentList
            )
          )
        ).toEqual({
          ...INITIAL_STATE,
          data: {
            ...INITIAL_STATE.data,
            items: {
              ...INITIAL_STATE.data.items,
              [item.id]: {
                pickedByUser: false,
                count: 0,
                createdAt: undefined
              }
            }
          },
          loading: []
        })
      })
    })

    describe("and the item wasn't picked before and now is", () => {
      beforeEach(() => {
        initialState = {
          ...initialState,
          data: {
            ...initialState.data,
            items: {
              ...initialState.data.items,
              [item.id]: {
                pickedByUser: false,
                count: 1,
                createdAt: Date.now()
              }
            }
          }
        }
      })

      it("should return a state where the item favorite data hasn't changed and the loading state cleared", () => {
        expect(
          favoritesReducer(
            initialState,
            bulkPickUnpickSuccess(
              item,
              [listOfLists],
              [],
              true,
              ownerRemovedFromCurrentList
            )
          )
        ).toEqual({
          ...INITIAL_STATE,
          data: {
            ...INITIAL_STATE.data,
            items: {
              ...initialState.data.items
            }
          },
          loading: []
        })
      })
    })

    describe('and the item was picked before and it is still picked', () => {
      beforeEach(() => {
        initialState = {
          ...initialState,
          data: {
            ...initialState.data,
            items: {
              ...initialState.data.items,
              [item.id]: {
                pickedByUser: true,
                count: 1,
                createdAt: Date.now()
              }
            }
          }
        }
      })

      it('should return a state where the item is flagged as not picked by the user, the created date set as undefined, the counter decreased and the loading state cleared', () => {
        expect(
          favoritesReducer(
            initialState,
            bulkPickUnpickSuccess(
              item,
              [listOfLists],
              [],
              true,
              ownerRemovedFromCurrentList
            )
          )
        ).toEqual({
          ...INITIAL_STATE,
          data: {
            ...INITIAL_STATE.data,
            items: {
              ...INITIAL_STATE.data.items,
              [item.id]: {
                pickedByUser: false,
                count: 0,
                createdAt: undefined
              }
            }
          },
          loading: []
        })
      })
    })
  })

  describe('and the item was not removed by the owner from the current list', () => {
    beforeEach(() => {
      ownerRemovedFromCurrentList = false
    })

    describe("and the item was picked before and now isn't", () => {
      beforeEach(() => {
        initialState = {
          ...initialState,
          data: {
            ...initialState.data,
            items: {
              ...initialState.data.items,
              [item.id]: {
                pickedByUser: true,
                count: 1,
                createdAt: Date.now()
              }
            }
          }
        }
      })

      it('should return a state where the item is flagged as not picked by the user, the created date set as undefined, the counter decreased and the loading state cleared', () => {
        expect(
          favoritesReducer(
            initialState,
            bulkPickUnpickSuccess(
              item,
              [listOfLists],
              [],
              false,
              ownerRemovedFromCurrentList
            )
          )
        ).toEqual({
          ...INITIAL_STATE,
          data: {
            ...INITIAL_STATE.data,
            items: {
              ...INITIAL_STATE.data.items,
              [item.id]: {
                pickedByUser: false,
                count: 0,
                createdAt: undefined
              }
            }
          },
          loading: []
        })
      })
    })

    describe("and the item wasn't picked before and now is", () => {
      let oldDate: number
      let newDate: number

      beforeEach(() => {
        oldDate = Date.now()
        newDate = oldDate + 30
        jest.spyOn(Date, 'now').mockReturnValueOnce(newDate)
        initialState = {
          ...initialState,
          data: {
            ...initialState.data,
            items: {
              ...initialState.data.items,
              [item.id]: {
                pickedByUser: false,
                count: 1,
                createdAt: oldDate
              }
            }
          }
        }
      })

      it('should return a state where the item is flagged as picked by the user, the created date set as now, the counter increased and the loading state cleared', () => {
        expect(
          favoritesReducer(
            initialState,
            bulkPickUnpickSuccess(
              item,
              [listOfLists],
              [],
              true,
              ownerRemovedFromCurrentList
            )
          )
        ).toEqual({
          ...INITIAL_STATE,
          data: {
            ...INITIAL_STATE.data,
            items: {
              ...INITIAL_STATE.data.items,
              [item.id]: {
                pickedByUser: true,
                count: 2,
                createdAt: newDate
              }
            }
          },
          loading: []
        })
      })
    })

    describe('and the item was picked before and it is still picked', () => {
      beforeEach(() => {
        initialState = {
          ...initialState,
          data: {
            ...initialState.data,
            items: {
              ...initialState.data.items,
              [item.id]: {
                pickedByUser: true,
                count: 1,
                createdAt: Date.now()
              }
            }
          }
        }
      })

      it("should return an estate where the pick didn't change at all and the loading state cleared", () => {
        expect(
          favoritesReducer(
            initialState,
            bulkPickUnpickSuccess(
              item,
              [listOfLists],
              [],
              true,
              ownerRemovedFromCurrentList
            )
          )
        ).toEqual({
          ...initialState,
          loading: []
        })
      })
    })
  })

  describe('and the item was added or removed from some lists', () => {
    let aList: List
    let anotherList: List
    let aListOfLists: ListOfLists
    let anotherListOfLists: ListOfLists

    beforeEach(() => {
      aList = {
        ...actionList
      }
      anotherList = {
        ...actionList,
        id: 'anotherListId'
      }
      aListOfLists = {
        id: aList.id,
        name: aList.name,
        itemsCount: aList.itemsCount,
        previewOfItemIds: aList.previewOfItemIds ?? [],
        isPrivate: aList.isPrivate ?? true
      }
      anotherListOfLists = {
        id: anotherList.id,
        name: anotherList.name,
        itemsCount: anotherList.itemsCount,
        previewOfItemIds: anotherList.previewOfItemIds ?? [],
        isPrivate: anotherList.isPrivate ?? true
      }
      initialState = {
        ...initialState,
        data: {
          ...initialState.data,
          lists: {
            [aList.id]: aList,
            [anotherList.id]: anotherList
          }
        }
      }
    })

    it('should decrease or increase the item count in the lists accordingly and remove the loading state', () => {
      expect(
        favoritesReducer(
          initialState,
          bulkPickUnpickSuccess(
            item,
            [aListOfLists],
            [anotherListOfLists],
            true,
            false
          )
        )
      ).toEqual({
        ...initialState,
        data: {
          ...initialState.data,
          lists: {
            ...initialState.data.lists,
            [aList.id]: {
              ...initialState.data.lists[aList.id],
              itemsCount: aList.itemsCount + 1
            },
            [anotherList.id]: {
              ...initialState.data.lists[anotherList.id],
              itemsCount: anotherList.itemsCount - 1
            }
          },
          items: {
            [item.id]: {
              pickedByUser: true,
              count: 1,
              createdAt: undefined
            }
          }
        },
        loading: []
      })
    })
  })
})
