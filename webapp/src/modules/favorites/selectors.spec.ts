import { RootState } from '../reducer'
import {} from './actions'
import { INITIAL_STATE } from './reducer'
import {
  getCount,
  getData,
  getError,
  getFavoritesDataByItemId,
  getIsPickedByUser,
  getLoading,
  getState
} from './selectors'

let state: RootState

beforeEach(() => {
  state = {
    favorites: {
      ...INITIAL_STATE,
      data: {
        item1: {
          pickedByUser: false,
          count: 18
        },
        item2: {},
        item3: {}
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
      state.favorites.data.item1
    )
  })
})

describe('when getting the if an item is picked by user', () => {
  describe('and the data is already in the store', () => {
    it('should return the a boolean with the value', () => {
      expect(getIsPickedByUser(state, 'item1')).toEqual(
        state.favorites.data.item1.pickedByUser
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
      expect(getCount(state, 'item1')).toEqual(state.favorites.data.item1.count)
    })
  })

  describe('and the data was not loaded to the store yet', () => {
    it('should return the numeric value representing the count', () => {
      expect(getCount(state, 'item1111')).toEqual(0)
    })
  })
})
