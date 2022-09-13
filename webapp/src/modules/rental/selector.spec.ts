import { NFTCategory, RentalListing } from '@dcl/schemas'
import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import { RootState } from '../reducer'
import { NFT } from '../nft/types'
import { claimLandRequest } from './actions'
import {
  getState,
  getData,
  getRentalById,
  isSigningTransaction,
  isClaimingLand
} from './selectors'

let rootState: RootState

beforeEach(() => {
  rootState = {
    rental: {
      data: {} as Record<string, RentalListing>,
      loading: [] as LoadingState,
      error: null,
      isSubmittingTransaction: false
    }
  } as RootState
})

describe('when getting the rentals state from the root state', () => {
  it('should retrieve the rentals state', () => {
    expect(getState(rootState)).toBe(rootState.rental)
  })
})

describe('when getting the data of the rental state', () => {
  it('should retrieve the data of the rental state', () => {
    expect(getData(rootState)).toBe(rootState.rental.data)
  })
})

describe('when getting a rental by id', () => {
  let id: string

  beforeEach(() => {
    id = 'aRentalId'
  })

  describe('and the rental exists in the state', () => {
    beforeEach(() => {
      rootState.rental.data = {
        [id]: { id, category: NFTCategory.PARCEL } as RentalListing
      }
    })

    it('should return the rental', () => {
      expect(getRentalById(rootState, id)).toBe(rootState.rental.data[id])
    })
  })

  describe("and the rental doesn't exist in the state", () => {
    beforeEach(() => {
      delete rootState.rental.data[id]
    })

    it('should return null', () => {
      expect(getRentalById(rootState, id)).toBe(null)
    })
  })
})

describe('when getting if a LAND is being claimed', () => {
  describe('and the LAND is being claimed', () => {
    beforeEach(() => {
      rootState.rental.loading = [
        claimLandRequest({} as NFT, {} as RentalListing)
      ]
    })

    it('should return true', () => {
      expect(isClaimingLand(rootState)).toBe(true)
    })
  })

  describe('and the LAND is not being claimed', () => {
    beforeEach(() => {
      rootState.rental.loading = []
    })

    it('should return false', () => {
      expect(isClaimingLand(rootState)).toBe(false)
    })
  })
})

describe('when getting if the claiming LAND transaction is being signed', () => {
  describe('and the transaction is being signed', () => {
    beforeEach(() => {
      rootState.rental.isSubmittingTransaction = true
    })

    it('should return true', () => {
      expect(isSigningTransaction(rootState)).toBe(true)
    })
  })

  describe('and the transaction is not being signed', () => {
    beforeEach(() => {
      rootState.rental.isSubmittingTransaction = false
    })

    it('should return false', () => {
      expect(isSigningTransaction(rootState)).toBe(false)
    })
  })
})
