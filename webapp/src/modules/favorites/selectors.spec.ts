import { RootState } from '../reducer'
import {} from './actions'
import { INITIAL_STATE } from './reducer'
import {
  getData,
  getError,
  getFavoritesDataByItemId,
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
