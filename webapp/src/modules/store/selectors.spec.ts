import { RootState } from '../reducer'
import { StoreState } from './reducer'
import {
  getLocalStore,
  getState,
  getError,
  getLoading,
  getData
} from './selectors'

let state: RootState

beforeEach(() => {
  state = {
    store: {
      data: {},
      error: null,
      loading: [],
      localStore: null
    } as StoreState
  } as RootState
})

describe('when getting the whole store state', () => {
  it('should return the current state of the store', () => {
    const result = getState(state)
    expect(result).toStrictEqual(state.store)
  })
})

describe('when getting the local store from the store state', () => {
  it('should return the local store object', () => {
    const result = getLocalStore(state)
    expect(result).toStrictEqual(state.store.localStore)
  })
})

describe('when getting the error from the store state', () => {
  it('should return the error', () => {
    const result = getError(state)
    expect(result).toStrictEqual(state.store.error)
  })
})

describe('when getting the data from the store state', () => {
  it('should return the data record', () => {
    const result = getData(state)
    expect(result).toStrictEqual(state.store.data)
  })
})

describe('when getting the loading from the store state', () => {
  it('should return the data record', () => {
    const result = getLoading(state)
    expect(result).toStrictEqual(state.store.loading)
  })
})
