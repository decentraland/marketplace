import {
  fetchStoreFailure,
  fetchStoreRequest,
  fetchStoreSuccess,
  revertLocalStore,
  updateLocalStore
} from './actions'
import { StoreState, storeReducer } from './reducer'
import { Store } from './types'

let state: StoreState
let mockStore: Store

beforeEach(() => {
  state = {
    data: {},
    error: null,
    loading: [],
    localStore: null
  }

  mockStore = {
    owner: 'owner',
    cover: 'cover',
    coverName: 'coverName',
    description: 'description',
    discord: 'discord',
    website: 'website',
    twitter: 'twitter',
    facebook: 'facebook'
  }
})

describe('when reducing the action that signals an update to the local store', () => {
  it('should return a state where the local store was updated', () => {
    const action = updateLocalStore(mockStore)
    const result = storeReducer(state, action)

    expect(result).toStrictEqual({ ...state, localStore: mockStore })
  })
})

describe('when reducing the action that signals a revert of the local store', () => {
  describe('when there is data for the given address in the store', () => {
    beforeEach(() => {
      state = {
        ...state,
        data: { [mockStore.owner]: mockStore }
      }
    })

    it('should return a state where the local store is null', () => {
      const action = revertLocalStore(mockStore.owner)
      const result = storeReducer(state, action)

      expect(result).toStrictEqual({
        ...state,
        localStore: mockStore
      } as StoreState)
    })
  })

  describe('when there is no data for the given address in the store', () => {
    beforeEach(() => {
      state = {
        ...state,
        localStore: mockStore
      }
    })

    it('should return a state where the local store is null', () => {
      const action = revertLocalStore(mockStore.owner)
      const result = storeReducer(state, action)

      expect(result).toStrictEqual({
        ...state,
        localStore: null
      } as StoreState)
    })
  })
})

describe('when reducing the action that signals fetching a user store', () => {
  it('should add the action to the loading array', () => {
    const action = fetchStoreRequest('address')
    const result = storeReducer(state, action)

    expect(result).toStrictEqual({
      ...state,
      loading: [action]
    } as StoreState)
  })
})

describe('when reducing the action that signals fetching a user store successfully', () => {
  beforeEach(() => {
    state = {
      ...state,
      error: 'some error'
    }
  })

  it('should set the error to null and update the data record with the new store', () => {
    const action = fetchStoreSuccess(mockStore)
    const result = storeReducer(state, action)

    expect(result).toStrictEqual({
      ...state,
      data: { [mockStore.owner]: mockStore },
      error: null
    } as StoreState)
  })
})

describe('when reducing the action that signals fetching a user store unsuccessfully', () => {
  it('should set the error to the one provided in the action', () => {
    const error = 'some error'
    const action = fetchStoreFailure(error)
    const result = storeReducer(state, action)

    expect(result).toStrictEqual({
      ...state,
      error
    } as StoreState)
  })
})
