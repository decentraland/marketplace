import { match } from 'react-router-dom'
import { Item } from '@dcl/schemas'
import { WalletState } from 'decentraland-dapps/dist/modules/wallet'
import { getDefaultState } from '../../tests/defaultStore'
import { RootState } from '../reducer'
import { locations } from '../routing/locations'
import { DEFAULT_FAVORITES_LIST_ID, ListOfLists } from '../vendor/decentraland/favorites'
import {
  bulkPickUnpickRequest,
  createListRequest,
  deleteListRequest,
  fetchFavoritedItemsRequest,
  fetchListsRequest,
  updateListRequest
} from './actions'
import { INITIAL_STATE } from './reducer'
import {
  getCount,
  getData,
  getError,
  getFavoritedItems,
  isLoadingFavoritedItems,
  getFavoritesDataByItemId,
  getIsPickedByUser,
  getListId,
  getLoading,
  getState,
  isPickingOrUnpicking,
  getLists,
  getList,
  isLoadingCreateList,
  isLoadingLists,
  getPreviewListItems,
  isLoadingBulkPicksUnpicks,
  isLoadingUpdateList,
  isLoadingDeleteList,
  isOwnerUnpickingFromCurrentList
} from './selectors'
import { List } from './types'

let state: RootState

beforeEach(() => {
  const defaultState = getDefaultState()
  state = {
    ...defaultState,
    favorites: {
      ...INITIAL_STATE,
      data: {
        ...INITIAL_STATE.data,
        items: {
          ...INITIAL_STATE.data.items,
          item1: {
            pickedByUser: false,
            count: 18
          },
          item2: {
            pickedByUser: false,
            count: 0
          },
          item3: {
            pickedByUser: false,
            count: 0
          }
        },
        lists: {
          ...INITIAL_STATE.data.lists,
          listId: {
            id: 'listId',
            name: 'aListName',
            description: 'aListDescription',
            previewOfItemIds: ['item1', 'item2', 'item3'],
            itemsCount: 3
          }
        }
      },
      error: 'anError',
      loading: []
    },
    item: {
      ...defaultState.item,
      data: {
        item1: {
          id: 'item1'
        } as Item,
        item2: {
          id: 'item2'
        } as Item
      }
    },
    wallet: {
      ...defaultState.wallet,
      data: {
        address: 'anAddress'
      }
    } as WalletState
  }
})

describe("when getting the favorites' state", () => {
  it('should return the state', () => {
    expect(getState(state)).toEqual(state.favorites)
  })
})

describe('when getting the data of the state', () => {
  it('should return the data', () => {
    expect(getData(state)).toEqual(state.favorites.data)
  })
})

describe('when getting the favorited items of the state', () => {
  it('should return the items', () => {
    expect(getFavoritedItems(state)).toEqual(state.favorites.data.items)
  })
})

describe('when getting the error of the state', () => {
  it('should return the error message', () => {
    expect(getError(state)).toEqual(state.favorites.error)
  })
})

describe('when getting the loading state of the state', () => {
  it('should return the loading state', () => {
    expect(getLoading(state)).toEqual(state.favorites.loading)
  })
})

describe('when getting the favorites data by item id', () => {
  it('should return the favorites data state for the given item id', () => {
    expect(getFavoritesDataByItemId(state, 'item1')).toEqual(state.favorites.data.items.item1)
  })
})

describe('when getting the if an item is picked by user', () => {
  describe('and the data is already in the store', () => {
    it('should return the a boolean with the value', () => {
      expect(getIsPickedByUser(state, 'item1')).toEqual(state.favorites.data.items.item1?.pickedByUser)
    })
  })

  describe('and the data was not loaded to the store yet', () => {
    it('should return false', () => {
      expect(getIsPickedByUser(state, 'item1111')).toEqual(false)
    })
  })
})

describe('when getting the count of favorites an item has', () => {
  describe('and the data is already in the store', () => {
    it('should return the numeric value representing the count', () => {
      expect(getCount(state, 'item1')).toEqual(state.favorites.data.items.item1?.count)
    })
  })

  describe('and the data was not loaded to the store yet', () => {
    it('should return the numeric value representing the count', () => {
      expect(getCount(state, 'item1111')).toEqual(0)
    })
  })
})

describe('when getting the listId from the pathname', () => {
  let listId: string
  let listIdMatch: match<{ listId: string }>

  beforeEach(() => {
    listId = 'list-id'
    listIdMatch = {
      params: {
        listId
      },
      path: locations.list('list-id')
    } as match<{ listId: string }>
  })

  it('should return the listId that comes after /lists', () => {
    expect(getListId.resultFunc(listIdMatch)).toBe(listId)
  })
})

describe('when getting if the favorited items are being loaded', () => {
  describe("and there's no favorited items request action in the loading state", () => {
    it('should return false', () => {
      expect(isLoadingFavoritedItems(state)).toBe(false)
    })
  })

  describe("and there's a favorited items request action in the loading state", () => {
    beforeEach(() => {
      state.favorites.loading = [fetchFavoritedItemsRequest({})]
    })

    it('should return true', () => {
      expect(isLoadingFavoritedItems(state)).toBe(true)
    })
  })
})

describe('when getting if an item is being bulk picked or unpicked', () => {
  let itemId: string
  let item: Item

  beforeEach(() => {
    itemId = '0xaddress-anItemId'
    item = { id: itemId } as Item
    state.favorites.loading = []
  })

  describe(`and no items are being bulk picked or unpicked`, () => {
    beforeEach(() => {
      state.favorites.loading = []
    })

    it('should return false', () => {
      expect(isPickingOrUnpicking(state, itemId)).toBe(false)
    })
  })

  describe(`and it isn't not being bulk picked or unpicked`, () => {
    beforeEach(() => {
      state.favorites.loading = [bulkPickUnpickRequest({ id: '0xaddress-anotherItemId' } as Item, [], [])]
    })

    it('should return false', () => {
      expect(isPickingOrUnpicking(state, itemId)).toBe(false)
    })
  })

  describe(`and it is being bulk picked or unpicked`, () => {
    beforeEach(() => {
      state.favorites.loading.push(bulkPickUnpickRequest(item, [], []))
    })

    it('should return true', () => {
      expect(isPickingOrUnpicking(state, itemId)).toBe(true)
    })
  })
})

describe('when getting the lists', () => {
  it('should return the lists', () => {
    expect(getLists(state)).toEqual(state.favorites.data.lists)
  })
})

describe('when getting a list by id', () => {
  describe('and the list is not loaded', () => {
    it('should return null', () => {
      expect(getList(state, 'aNotLoadedListId')).toBeNull()
    })
  })

  describe('and the list is loaded in the state', () => {
    it('should return the list', () => {
      expect(getList(state, 'listId')).toEqual(state.favorites.data.lists['listId'])
    })
  })
})

describe('when getting if the create list request is being loaded', () => {
  describe("and there's no create list request action in the loading state", () => {
    beforeEach(() => {
      state.favorites.loading = []
    })

    it('should return false', () => {
      expect(isLoadingCreateList(state)).toBe(false)
    })
  })

  describe("and there's a create list request action in the loading state", () => {
    beforeEach(() => {
      state.favorites.loading = [
        createListRequest({
          name: 'aName',
          description: 'aDescription',
          isPrivate: true
        })
      ]
    })

    it('should return true', () => {
      expect(isLoadingCreateList(state)).toBe(true)
    })
  })
})

describe('when getting if the lists are being loaded', () => {
  describe("and there's no fetch lists request action in the loading state", () => {
    beforeEach(() => {
      state.favorites.loading = []
    })

    it('should return false', () => {
      expect(isLoadingLists(state)).toBe(false)
    })
  })

  describe("and there's a fetch lists request action in the loading state", () => {
    beforeEach(() => {
      state.favorites.loading = [fetchListsRequest({ page: 1, first: 24 })]
    })

    it('should return true', () => {
      expect(isLoadingLists(state)).toBe(true)
    })
  })
})

describe('when getting the preview loading items', () => {
  it('should get the items in the preview when they exist in the items state', () => {
    expect(getPreviewListItems(state, 'listId')).toEqual([state.item.data.item1, state.item.data.item2])
  })
})

describe('when getting if the update list request is being loaded', () => {
  describe("and there's no update list request action in the loading state", () => {
    it('should return false', () => {
      expect(isLoadingUpdateList(state)).toBe(false)
    })
  })

  describe("and there's a update list request action in the loading state", () => {
    beforeEach(() => {
      state.favorites.loading = [
        updateListRequest('aListId', {
          name: 'aName',
          description: 'aDescription',
          isPrivate: true
        })
      ]
    })

    it('should return true', () => {
      expect(isLoadingUpdateList(state)).toBe(true)
    })
  })
})

describe('when getting if the deletion of a list is being loaded', () => {
  let list: List
  beforeEach(() => {
    list = {
      id: 'aListId',
      name: 'aListName'
    } as List
  })

  describe("and there's no delete list request action in the loading state", () => {
    beforeEach(() => {
      state.favorites.loading = []
    })

    it('should return false', () => {
      expect(isLoadingDeleteList(state)).toBe(false)
    })
  })

  describe("and there's a delete list request action in the loading state", () => {
    beforeEach(() => {
      state.favorites.loading = [deleteListRequest(list)]
    })

    it('should return true', () => {
      expect(isLoadingDeleteList(state)).toBe(true)
    })
  })
})

describe("when getting if it's loading a bulk item pick and unpick", () => {
  describe("and there's no bulk pick and unpick action in the loading state", () => {
    beforeEach(() => {
      state.favorites.loading = []
    })

    it('should return false', () => {
      expect(isLoadingBulkPicksUnpicks(state)).toBe(false)
    })
  })

  describe("and there's a bulk pick and unpick action in the loading state", () => {
    beforeEach(() => {
      state.favorites.loading = [bulkPickUnpickRequest({} as Item, [], [])]
    })

    it('should return true', () => {
      expect(isLoadingBulkPicksUnpicks(state)).toBe(true)
    })
  })
})

describe('when getting if the owner of the current list is unpicking an item from the list', () => {
  let unpickedFrom: ListOfLists[]

  beforeEach(() => {
    unpickedFrom = [
      {
        id: 'aListId',
        name: 'aList',
        itemsCount: 2,
        isPrivate: true,
        previewOfItemIds: []
      }
    ]
    state = {
      ...state,
      router: {
        location: {
          pathname: locations.list('aListId')
        },
        action: {} as any
      } as any
    }
  })

  describe("and the list isn't the default list", () => {
    beforeEach(() => {
      unpickedFrom[0].id = 'aListId'
      state = {
        ...state,
        favorites: {
          ...state.favorites,
          data: {
            ...state.favorites.data,
            lists: {
              ...state.favorites.data.lists,
              [unpickedFrom[0].id]: {
                ...unpickedFrom[0],
                userAddress: 'anAddress'
              }
            }
          }
        }
      }
    })

    describe("and the user isn't the owner of the list", () => {
      beforeEach(() => {
        state = {
          ...state,
          wallet: {
            ...state.wallet,
            data: {
              address: 'anotherAddress'
            } as any
          }
        }
      })

      describe('and the item is being unpicked from the current list', () => {
        beforeEach(() => {
          state.router.location.pathname = locations.list(unpickedFrom[0].id)
        })

        it('should return false', () => {
          expect(isOwnerUnpickingFromCurrentList(state, unpickedFrom)).toBe(false)
        })
      })

      describe("and the item isn't being unpicked from the current list", () => {
        beforeEach(() => {
          state.router.location.pathname = locations.list('someOtherId')
        })

        it('should return false', () => {
          expect(isOwnerUnpickingFromCurrentList(state, unpickedFrom)).toBe(false)
        })
      })
    })

    describe('and the user is the owner of the list', () => {
      beforeEach(() => {
        state = {
          ...state,
          wallet: {
            ...state.wallet,
            data: {
              address: state.favorites.data.lists[unpickedFrom[0].id].userAddress ?? ''
            } as any
          }
        }
      })

      describe('and the item is being unpicked from the current list', () => {
        beforeEach(() => {
          state.router.location.pathname = locations.list(unpickedFrom[0].id)
        })

        it('should return true', () => {
          expect(isOwnerUnpickingFromCurrentList(state, unpickedFrom)).toBe(true)
        })
      })

      describe("and the item isn't being unpicked from the current list", () => {
        beforeEach(() => {
          state.router.location.pathname = locations.list('someOtherId')
        })

        it('should return false', () => {
          expect(isOwnerUnpickingFromCurrentList(state, unpickedFrom)).toBe(false)
        })
      })
    })
  })
  describe('and the list is the default list', () => {
    beforeEach(() => {
      unpickedFrom[0].id = DEFAULT_FAVORITES_LIST_ID
      state = {
        ...state,
        favorites: {
          ...state.favorites,
          data: {
            ...state.favorites.data,
            lists: {
              ...state.favorites.data.lists,
              [unpickedFrom[0].id]: {
                ...unpickedFrom[0],
                userAddress: 'anAddress'
              }
            }
          }
        }
      }
    })

    describe("and the user isn't the owner of the list", () => {
      beforeEach(() => {
        state = {
          ...state,
          wallet: {
            ...state.wallet,
            data: {
              address: 'anotherAddress'
            } as any
          }
        }
      })

      describe('and the item is being unpicked from the current list', () => {
        beforeEach(() => {
          state.router.location.pathname = locations.list(unpickedFrom[0].id)
        })

        it('should return true', () => {
          expect(isOwnerUnpickingFromCurrentList(state, unpickedFrom)).toBe(true)
        })
      })

      describe("and the item isn't being unpicked from the current list", () => {
        beforeEach(() => {
          state.router.location.pathname = locations.list('someOtherId')
        })

        it('should return false', () => {
          expect(isOwnerUnpickingFromCurrentList(state, unpickedFrom)).toBe(false)
        })
      })
    })

    describe('and the user is the owner of the list', () => {
      beforeEach(() => {
        state = {
          ...state,
          wallet: {
            ...state.wallet,
            data: {
              address: state.favorites.data.lists[unpickedFrom[0].id].userAddress ?? ''
            } as any
          }
        }
      })

      describe('and the item is being unpicked from the current list', () => {
        beforeEach(() => {
          state.router.location.pathname = locations.list(unpickedFrom[0].id)
        })

        it('should return true', () => {
          expect(isOwnerUnpickingFromCurrentList(state, unpickedFrom)).toBe(true)
        })
      })

      describe("and the item isn't being unpicked from the current list", () => {
        beforeEach(() => {
          state.router.location.pathname = locations.list('someOtherId')
        })

        it('should return false', () => {
          expect(isOwnerUnpickingFromCurrentList(state, unpickedFrom)).toBe(false)
        })
      })
    })
  })
})
