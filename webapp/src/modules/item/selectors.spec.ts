import { Item } from '@dcl/schemas'
import { AuthorizationStepStatus } from 'decentraland-ui'
import { RootState } from '../reducer'
import { buyItemRequest, fetchItemRequest, fetchItemsRequest } from './actions'
import { INITIAL_STATE } from './reducer'
import {
  getData,
  getError,
  getLoading,
  getMintItemStatus,
  getState,
  isFetchingItem,
  isFetchingItemsOfCollection
} from './selectors'

let state: RootState

beforeEach(() => {
  state = {
    item: {
      ...INITIAL_STATE,
      data: {
        anItemId: {} as Item
      },
      error: 'anError',
      loading: []
    }
  } as any
})

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

describe('when getting if an item is being fetched', () => {
  let contractAddress: string
  let tokenId: string

  beforeEach(() => {
    contractAddress = 'aContractAddress'
    tokenId = 'aTokenId'
    state.item.loading = []
  })

  describe('and no items are being fetched', () => {
    beforeEach(() => {
      state.item.loading = []
    })

    it('should return false', () => {
      expect(isFetchingItem(state, contractAddress, tokenId)).toBe(false)
    })
  })

  describe("and it isn't not being fetched", () => {
    beforeEach(() => {
      state.item.loading = [fetchItemRequest(contractAddress, 'anotherTokenId')]
    })

    it('should return false', () => {
      expect(isFetchingItem(state, contractAddress, tokenId)).toBe(false)
    })
  })

  describe('and it is being fetched', () => {
    beforeEach(() => {
      state.item.loading.push(fetchItemRequest(contractAddress, tokenId))
    })

    it('should return true', () => {
      expect(isFetchingItem(state, contractAddress, tokenId)).toBe(true)
    })
  })
})

describe('when getting if the items of a collection are being fetched', () => {
  let contractAddress: string

  beforeEach(() => {
    contractAddress = 'aContractAddress'
    state.item.loading = []
  })

  describe('and there are no items being fetched', () => {
    beforeEach(() => {
      state.item.loading = []
    })

    it('should return false', () => {
      expect(isFetchingItemsOfCollection(state, contractAddress)).toBe(false)
    })
  })

  describe("and they're not being fetched", () => {
    beforeEach(() => {
      state.item.loading.push(
        fetchItemsRequest({
          filters: { contracts: ['anotherContractAddress'] }
        })
      )
    })

    it('should return false', () => {
      expect(isFetchingItemsOfCollection(state, contractAddress)).toBe(false)
    })
  })

  describe("and they're being fetched", () => {
    beforeEach(() => {
      state.item.loading.push(
        fetchItemsRequest({ filters: { contracts: [contractAddress] } })
      )
    })

    it('should return true', () => {
      expect(isFetchingItemsOfCollection(state, contractAddress)).toBe(true)
    })
  })
})

describe('when getting the mint item status', () => {
  describe('and a mint item request is loading', () => {
    beforeEach(() => {
      state.item.loading = [buyItemRequest({} as Item)]
    })

    it('should return WAITING status', () => {
      expect(getMintItemStatus(state)).toEqual(AuthorizationStepStatus.WAITING)
    })
  })

  describe('and there is an error in mint item flow', () => {
    beforeEach(() => {
      state.item.error = 'Some test error'
    })

    it('should return ERROR status', () => {
      expect(getMintItemStatus(state)).toEqual(AuthorizationStepStatus.ERROR)
    })
  })

  describe('and there is no error and the loading field is empty', () => {
    beforeEach(() => {
      state.item.loading = []
      state.item.error = null
    })

    it('should return PENDING status', () => {
      expect(getMintItemStatus(state)).toEqual(AuthorizationStepStatus.PENDING)
    })
  })
})
