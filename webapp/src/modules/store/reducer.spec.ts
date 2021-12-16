import { revertLocalStore, updateLocalStore } from './actions'
import { StoreState, storeReducer } from './reducer'
import { Store } from './types'
import { getEmptyLocalStore } from './utils'

let state: StoreState
let filledLocalStore: Store
let emptyLocalStore: Store

beforeEach(() => {
  state = {
    localStore: {
      owner: '',
      cover: '',
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
    description: 'description',
    discord: 'discord',
    website: 'website',
    twitter: 'twitter',
    facebook: 'facebook'
  }

  emptyLocalStore = getEmptyLocalStore()
})

describe('when reducing the action that signals an update to the local store', () => {
  it('should return a state where the local store was updated', () => {
    const result = storeReducer(state, updateLocalStore(filledLocalStore))

    expect(result).toStrictEqual({
      localStore: filledLocalStore
    })
  })
})

describe('when reducing the action that signals a revert of the local store', () => {
  beforeEach(() => {
    state = { localStore: filledLocalStore }
  })

  it('should return a state where the local store was updated', () => {
    const result = storeReducer(state, revertLocalStore())

    expect(result).toStrictEqual({
      localStore: emptyLocalStore
    })
  })
})
