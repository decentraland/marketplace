import { revertLocalStore, updateLocalStore } from './actions'
import { StoreState, storeReducer } from './reducer'
import { Store } from './types'

let state: StoreState
let filledLocalStore: Store

beforeEach(() => {
  state = {
    data: {},
    error: null,
    loading: [],
    localStore: {
      owner: '',
      cover: '',
      coverName: '',
      description: '',
      discord: '',
      website: '',
      twitter: '',
      facebook: ''
    }
  }

  filledLocalStore = {
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
    const result = storeReducer(state, updateLocalStore(filledLocalStore))

    expect(result).toStrictEqual({
      ...state,
      localStore: filledLocalStore
    })
  })
})

describe('when reducing the action that signals a revert of the local store', () => {
  beforeEach(() => {
    state = {
      ...state,
      localStore: filledLocalStore
    }
  })

  it('should return a state where the local store was updated', () => {
    const result = storeReducer(state, revertLocalStore('address'))

    expect(result).toStrictEqual({
      ...state,
      localStore: null
    })
  })
})
