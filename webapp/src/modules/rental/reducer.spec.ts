import { RentalListing, RentalStatus } from '@dcl/schemas'
import { fetchNFTsSuccess, fetchNFTSuccess } from '../nft/actions'
import { NFT, NFTsFetchOptions } from '../nft/types'
import {
  claimLandFailure,
  claimLandRequest,
  claimLandTransactionSubmitted,
  claimLandSuccess,
  createRentalFailure,
  createRentalRequest,
  CreateRentalRequestAction,
  createRentalSuccess
} from './actions'
import { rentalReducer, RentalState } from './reducer'
import { PeriodOption } from './types'

let nft: NFT
let rental: RentalListing
let rentalState: RentalState

beforeEach(() => {
  nft = {
    id: 'someNft'
  } as NFT
  rental = {
    id: 'someRental'
  } as RentalListing
  rentalState = {
    data: {},
    loading: [],
    error: null,
    isSubmittingTransaction: false
  }
})

describe('when reducing a CREATE_RENTAL_REQUEST action', () => {
  let state: RentalState
  let action: CreateRentalRequestAction
  beforeEach(() => {
    state = {
      loading: [],
      data: {},
      error: 'some error',
      isSubmittingTransaction: false
    }
    action = createRentalRequest(
      nft,
      100,
      [PeriodOption.ONE_WEEK],
      1976562675847
    )
  })
  it('should add a the action to the loading state', () => {
    const newState = rentalReducer(state, action)
    expect(newState.loading).toHaveLength(1)
    expect(newState.loading[0]).toEqual(action)
  })
  it('should clear the error', () => {
    const newState = rentalReducer(state, action)
    expect(newState.error).toBe(null)
  })
})

describe('when reducing a CREATE_RENTAL_SUCCESS action', () => {
  let state: RentalState
  beforeEach(() => {
    state = {
      loading: [
        createRentalRequest(nft, 100, [PeriodOption.ONE_WEEK], 1976562675847)
      ],
      data: {},
      error: 'Some error',
      isSubmittingTransaction: false
    }
  })
  it('should remove the loading action', () => {
    const newState = rentalReducer(state, createRentalSuccess(nft, rental))
    expect(newState.loading).toHaveLength(0)
  })
  it('should clear the error', () => {
    const newState = rentalReducer(state, createRentalSuccess(nft, rental))
    expect(newState.error).toBe(null)
  })
  it('should add the rental to the data record', () => {
    const newState = rentalReducer(state, createRentalSuccess(nft, rental))
    expect(newState.data).toEqual({
      [rental.id]: rental
    })
  })
})

describe('when reducing a CREATE_RENTAL_FAILURE action', () => {
  let state: RentalState
  beforeEach(() => {
    state = {
      loading: [
        createRentalRequest(nft, 100, [PeriodOption.ONE_WEEK], 1976562675847)
      ],
      data: {},
      error: null,
      isSubmittingTransaction: false
    }
  })
  it('should remove the loading action', () => {
    const newState = rentalReducer(
      state,
      createRentalFailure(
        nft,
        100,
        [PeriodOption.ONE_WEEK],
        1976562675847,
        'some error'
      )
    )
    expect(newState.loading).toHaveLength(0)
  })
  it('should store the error', () => {
    const newState = rentalReducer(
      state,
      createRentalFailure(
        nft,
        100,
        [PeriodOption.ONE_WEEK],
        1976562675847,
        'Some error'
      )
    )
    expect(newState.error).toBe('Some error')
  })
})

describe('when reducing the success action of fetching NFTs', () => {
  let oldRentalId: string
  let rentalListingsFromNFTServer: RentalListing[]

  beforeEach(() => {
    oldRentalId = 'aRentalId'
    rentalState = {
      ...rentalState,
      data: {
        ...rentalState.data,
        [oldRentalId]: {
          id: oldRentalId,
          status: RentalStatus.OPEN
        } as RentalListing
      }
    }
    rentalListingsFromNFTServer = [
      {
        id: 'aNewRentalId'
      } as RentalListing,
      { id: oldRentalId, status: RentalStatus.EXECUTED } as RentalListing
    ]
  })

  it('should add the new rental listings to the stored rentals and overwrite rentals that that the same id', () => {
    expect(
      rentalReducer(
        rentalState,
        fetchNFTsSuccess(
          {} as NFTsFetchOptions,
          [],
          [],
          [],
          rentalListingsFromNFTServer,
          2,
          Date.now()
        )
      )
    ).toEqual({
      ...rentalState,
      data: {
        ...rentalState.data,
        aNewRentalId: rentalListingsFromNFTServer[0],
        [oldRentalId]: rentalListingsFromNFTServer[1]
      }
    })
  })
})

describe('when reducing the success action of fetching a NFT', () => {
  let rentalListing: RentalListing | null

  describe('and the NFT has a rental', () => {
    beforeEach(() => {
      rentalListing = {
        id: 'aNewRentalListing'
      } as RentalListing
    })

    it('should store the rental', () => {
      expect(
        rentalReducer(
          rentalState,
          fetchNFTSuccess({} as NFT, null, rentalListing)
        )
      ).toEqual({
        ...rentalState,
        data: {
          ...rentalState.data,
          [rentalListing!.id]: rentalListing
        }
      })
    })
  })

  describe("and the NFT doesn't have a rental", () => {
    beforeEach(() => {
      rentalListing = null
    })

    it('should return the state unchanged', () => {
      expect(
        rentalReducer(
          rentalState,
          fetchNFTSuccess({} as NFT, null, rentalListing)
        )
      ).toBe(rentalState)
    })
  })
})

describe('when reducing the action that signals that the claim land transaction was submitted', () => {
  beforeEach(() => {
    rentalState = {
      ...rentalState,
      isSubmittingTransaction: true
    }
  })

  it('should set the flag that defines that the transaction is being submitted to false', () => {
    expect(
      rentalReducer(
        rentalState,
        claimLandTransactionSubmitted(nft, 'aTxHash', 'aRentalContractAddress')
      )
    ).toEqual({
      ...rentalState,
      isSubmittingTransaction: false
    })
  })
})

describe('when reducing the action of the start of claiming a LAND', () => {
  beforeEach(() => {
    rentalState = {
      ...rentalState,
      isSubmittingTransaction: false,
      loading: [],
      error: 'anError'
    }
  })

  it('should set the action into loading, the submitting transaction flag as true and clear the error', () => {
    expect(rentalReducer(rentalState, claimLandRequest(nft, rental))).toEqual({
      ...rentalState,
      isSubmittingTransaction: true,
      loading: [claimLandRequest(nft, rental)],
      error: null
    })
  })
})

describe('when reducing the action the success of claiming a LAND', () => {
  beforeEach(() => {
    rentalState = {
      ...rentalState,
      isSubmittingTransaction: true,
      loading: [claimLandRequest(nft, rental)],
      error: 'anError'
    }
  })

  it('should remove the loading, set the submitting transaction flag as false and clear the error', () => {
    expect(rentalReducer(rentalState, claimLandSuccess(nft, rental))).toEqual({
      ...rentalState,
      isSubmittingTransaction: false,
      loading: [],
      error: null
    })
  })
})

describe('when reducing the failure action of claiming a LAND', () => {
  beforeEach(() => {
    rentalState = {
      ...rentalState,
      loading: [claimLandRequest(nft, rental)],
      isSubmittingTransaction: true,
      error: null
    }
  })

  it("should remove the loading, set the submitting transaction flag to false, set the error with the action's error", () => {
    expect(rentalReducer(rentalState, claimLandFailure('anError'))).toEqual({
      ...rentalState,
      loading: [],
      isSubmittingTransaction: false,
      error: 'anError'
    })
  })
})
