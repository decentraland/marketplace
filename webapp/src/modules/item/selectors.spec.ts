import { Item } from '@dcl/schemas'
import { INITIAL_STATE } from './reducer'
import { getData, getError, getLoading, getState } from './selectors'

const state = {
  item: {
    ...INITIAL_STATE,
    data: {
      anItemId: {} as Item
    },
    error: 'anError',
    loading: []
  }
} as any

describe("when getting the item's state", () => {
  it('should return the state', () => {
    expect(getState(state)).toEqual(state.item)
  })
})

describe('when getting the data of the state', () => {
  it('should return the data', () => {
    expect(getData(state)).toEqual(state.item.data)
  })
})

describe('when getting the error of the state', () => {
  it('should return the error message', () => {
    expect(getError(state)).toEqual(state.item.error)
  })
})

describe('when getting the loading state of the state', () => {
  it('should return the loading state', () => {
    expect(getLoading(state)).toEqual(state.item.loading)
  })
})
