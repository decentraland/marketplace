import { Item } from '@dcl/schemas'
import { match } from 'react-router-dom'
import { RootState } from '../reducer'
import { locations } from '../routing/locations'
import { INITIAL_STATE } from './reducer'
import {
  getCount,
  getData,
  getError,
  getFavoritedItems,
  getFavoritesDataByItemId,
  getIsPickedByUser,
  getListId,
  getLoading,
  getState,
  isPickingOrUnpicking
} from './selectors'
import {
  pickItemAsFavoriteRequest,
  undoUnpickingItemAsFavoriteRequest,
  unpickItemAsFavoriteRequest
} from './actions'

let state: RootState

beforeEach(() => {
  state = {
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
          item2: {},
          item3: {}
        }
      },
      error: 'anError',
      loading: []
    }
  } as any
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
    expect(getFavoritesDataByItemId(state, 'item1')).toEqual(
      state.favorites.data.items.item1
    )
  })
})

describe('when getting the if an item is picked by user', () => {
  describe('and the data is already in the store', () => {
    it('should return the a boolean with the value', () => {
      expect(getIsPickedByUser(state, 'item1')).toEqual(
        state.favorites.data.items.item1?.pickedByUser
      )
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
      expect(getCount(state, 'item1')).toEqual(
        state.favorites.data.items.item1?.count
      )
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

describe.each([
  ['picked', pickItemAsFavoriteRequest],
  ['unpicked', unpickItemAsFavoriteRequest],
  ['undone', undoUnpickingItemAsFavoriteRequest]
])('when getting if an item is being %s', (description, action) => {
  let itemId: string
  let item: Item

  beforeEach(() => {
    itemId = '0xaddress-anItemId'
    item = { id: itemId } as Item
    state.favorites.loading = []
  })

  describe(`and no items are being ${description}`, () => {
    beforeEach(() => {
      state.favorites.loading = []
    })

    it('should return false', () => {
      expect(isPickingOrUnpicking(state, itemId)).toBe(false)
    })
  })

  describe(`and it isn't not being ${description}`, () => {
    beforeEach(() => {
      state.favorites.loading = [
        action({ id: '0xaddress-anotherItemId' } as Item)
      ]
    })

    it('should return false', () => {
      expect(isPickingOrUnpicking(state, itemId)).toBe(false)
    })
  })

  describe(`and it is being ${description}`, () => {
    beforeEach(() => {
      state.favorites.loading.push(action(item))
    })

    it('should return true', () => {
      expect(isPickingOrUnpicking(state, itemId)).toBe(true)
    })
  })
})
