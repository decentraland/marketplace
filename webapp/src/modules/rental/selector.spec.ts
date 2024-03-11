import { NFTCategory, RentalListing } from '@dcl/schemas'
import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import { AuthorizationStepStatus } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { RootState } from '../reducer'
import { NFT } from '../nft/types'
import { acceptRentalListingRequest, claimAssetRequest, removeRentalRequest } from './actions'
import {
  getState,
  getData,
  getRentalById,
  isSubmittingTransaction,
  isClaimingAsset,
  isRemovingRental,
  getRentConfirmationStatus
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
      rootState.rental.loading = [claimAssetRequest({} as NFT, {} as RentalListing)]
    })

    it('should return true', () => {
      expect(isClaimingAsset(rootState)).toBe(true)
    })
  })

  describe('and the LAND is not being claimed', () => {
    beforeEach(() => {
      rootState.rental.loading = []
    })

    it('should return false', () => {
      expect(isClaimingAsset(rootState)).toBe(false)
    })
  })
})

describe('when getting if a rental is being removed', () => {
  describe('and the rental is being removed', () => {
    beforeEach(() => {
      rootState.rental.loading = [removeRentalRequest({} as NFT)]
    })

    it('should return true', () => {
      expect(isRemovingRental(rootState)).toBe(true)
    })
  })

  describe('and the rental is not being removed', () => {
    beforeEach(() => {
      rootState.rental.loading = []
    })

    it('should return false', () => {
      expect(isRemovingRental(rootState)).toBe(false)
    })
  })
})

describe('when getting if the transaction is being submitted', () => {
  describe('and the transaction is being submitted', () => {
    beforeEach(() => {
      rootState.rental.isSubmittingTransaction = true
    })

    it('should return true', () => {
      expect(isSubmittingTransaction(rootState)).toBe(true)
    })
  })

  describe('and the transaction is not being submitted', () => {
    beforeEach(() => {
      rootState.rental.isSubmittingTransaction = false
    })

    it('should return false', () => {
      expect(isSubmittingTransaction(rootState)).toBe(false)
    })
  })
})

describe('when getting a rental confirmation status', () => {
  describe('and there is a transaction submitting', () => {
    beforeEach(() => {
      rootState.rental.isSubmittingTransaction = true
    })

    it('should return an authorization status WAITING', () => {
      expect(getRentConfirmationStatus(rootState)).toEqual(AuthorizationStepStatus.WAITING)
    })
  })

  describe('and there is a rental being accepted', () => {
    beforeEach(() => {
      rootState.rental.loading = [acceptRentalListingRequest({} as NFT, {} as RentalListing, 0, '')]
    })

    it('should return an authorization status PROCESSING', () => {
      expect(getRentConfirmationStatus(rootState)).toEqual(AuthorizationStepStatus.PROCESSING)
    })
  })

  describe('and there is an error', () => {
    beforeEach(() => {
      rootState.rental.error = 'error'
    })

    it('should return an authorization status ERROR', () => {
      expect(getRentConfirmationStatus(rootState)).toEqual(AuthorizationStepStatus.ERROR)
    })
  })

  describe('and there is no error and no transaction is being processed', () => {
    it('should return an authorization status PENDING', () => {
      expect(getRentConfirmationStatus(rootState)).toEqual(AuthorizationStepStatus.PENDING)
    })
  })
})
