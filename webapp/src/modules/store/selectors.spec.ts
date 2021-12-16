import { INITIAL_STATE } from './reducer'
import { RootState } from '../reducer'
import { getLocalStore, getState } from './selectors'

let state: RootState

beforeEach(() => {
  state = {
    store: { ...INITIAL_STATE }
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
