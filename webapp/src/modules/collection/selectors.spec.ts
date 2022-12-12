import { RootState } from '../reducer'
import {
  fetchCollectionsRequest,
  fetchSingleCollectionRequest
} from './actions'
import { isFetchingCollection } from './selectors'

let state: RootState
let contractAddress: string

beforeEach(() => {
  contractAddress = 'aContractAddress'
  state = {
    collection: {
      data: {},
      error: null,
      loading: [],
      count: 0
    }
  } as any
})

describe('when getting if a collection is being fetched', () => {
  describe("and there's no collection being fetched", () => {
    beforeEach(() => {
      state.collection.loading = []
    })

    it('should return false', () => {
      expect(isFetchingCollection(state, contractAddress)).toBe(false)
    })
  })

  describe("and the given collection isn't being fetched", () => {
    beforeEach(() => {
      state.collection.loading = [
        fetchCollectionsRequest({ contractAddress: 'anotherContractAddress' }),
        fetchCollectionsRequest({ first: 2 }),
        fetchSingleCollectionRequest('anotherContractAddress')
      ]
    })

    it('should return false', () => {
      expect(isFetchingCollection(state, contractAddress)).toBe(false)
    })
  })

  describe('and the given collection is being fetched in a single collection fetch', () => {
    beforeEach(() => {
      state.collection.loading = [fetchSingleCollectionRequest(contractAddress)]
    })

    it('should return true', () => {
      expect(isFetchingCollection(state, contractAddress)).toBe(true)
    })
  })

  describe('and the given collection is being fetched in a collections fetch', () => {
    beforeEach(() => {
      state.collection.loading = [
        fetchCollectionsRequest({ contractAddress: contractAddress })
      ]
    })

    it('should return true', () => {
      expect(isFetchingCollection(state, contractAddress)).toBe(true)
    })
  })
})
