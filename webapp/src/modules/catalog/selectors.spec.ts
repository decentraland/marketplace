import { CatalogItem } from '@dcl/schemas'
import { RootState } from '../reducer'
import { INITIAL_STATE } from './reducer'
import { getData, getError, getLoading, getState } from './selectors'

let state: RootState

beforeEach(() => {
  state = {
    catalogItem: {
      ...INITIAL_STATE,
      data: {
        anItemId: {} as CatalogItem
      },
      error: 'anError',
      loading: []
    }
  } as any
})

describe("when getting the catalogItem's state", () => {
  it('should return the state', () => {
    expect(getState(state)).toEqual(state.catalogItem)
  })
})

describe('when getting the data of the state', () => {
  it('should return the data', () => {
    expect(getData(state)).toEqual(state.catalogItem.data)
  })
})

describe('when getting the error of the state', () => {
  it('should return the error message', () => {
    expect(getError(state)).toEqual(state.catalogItem.error)
  })
})

describe('when getting the loading state of the state', () => {
  it('should return the loading state', () => {
    expect(getLoading(state)).toEqual(state.catalogItem.loading)
  })
})
