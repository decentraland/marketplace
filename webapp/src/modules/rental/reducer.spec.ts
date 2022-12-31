import { RentalListing, RentalStatus } from '@dcl/schemas'
import { fetchNFTsSuccess, fetchNFTSuccess } from '../nft/actions'
import { NFT, NFTsFetchOptions } from '../nft/types'
import {
  claimAssetFailure,
  claimAssetRequest,
  claimAssetTransactionSubmitted,
  claimAssetSuccess,
  upsertRentalFailure,
  upsertRentalRequest,
  UpsertRentalRequestAction,
  upsertRentalSuccess,
  removeRentalRequest,
  removeRentalFailure,
  removeRentalSuccess,
  acceptRentalListingRequest,
  acceptRentalListingSuccess,
  acceptRentalListingFailure,
  acceptRentalListingTransactionSubmitted
} from './actions'
import { rentalReducer, RentalState } from './reducer'
import { PeriodOption, UpsertRentalOptType } from './types'

let nft: NFT
let rental: RentalListing
let rentalState: RentalState

beforeEach(() => {
  rental = {
    id: 'someRental',
    periods: [{ maxDays: 10, minDays: 8, pricePerDay: '10000000' }]
  } as RentalListing
  nft = {
    id: 'someNft',
    openRentalId: rental.id
  } as NFT
  rentalState = {
    data: {},
    loading: [],
    error: null,
    isSubmittingTransaction: false
  }
})

describe('when reducing a UPSERT_RENTAL_REQUEST action', () => {
  let state: RentalState
  let action: UpsertRentalRequestAction
  beforeEach(() => {
    state = {
      loading: [],
      data: {},
      error: 'some error',
      isSubmittingTransaction: false
    }
    action = upsertRentalRequest(
      nft,
      100,
      [PeriodOption.ONE_WEEK],
      1976562675847,
      UpsertRentalOptType.INSERT
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

describe('when reducing a UPSERT_RENTAL_SUCCESS action', () => {
  let state: RentalState
  beforeEach(() => {
    state = {
      loading: [
        upsertRentalRequest(
          nft,
          100,
          [PeriodOption.ONE_WEEK],
          1976562675847,
          UpsertRentalOptType.INSERT
        )
      ],
      data: {},
      error: 'Some error',
      isSubmittingTransaction: false
    }
  })
  it('should remove the loading action', () => {
    const newState = rentalReducer(
      state,
      upsertRentalSuccess(nft, rental, UpsertRentalOptType.INSERT)
    )
    expect(newState.loading).toHaveLength(0)
  })
  it('should clear the error', () => {
    const newState = rentalReducer(
      state,
      upsertRentalSuccess(nft, rental, UpsertRentalOptType.INSERT)
    )
    expect(newState.error).toBe(null)
  })
  it('should add the rental to the data record', () => {
    const newState = rentalReducer(
      state,
      upsertRentalSuccess(nft, rental, UpsertRentalOptType.INSERT)
    )
    expect(newState.data).toEqual({
      [rental.id]: rental
    })
  })
})

describe('when reducing a UPSERT_RENTAL_FAILURE action', () => {
  let state: RentalState
  beforeEach(() => {
    state = {
      loading: [
        upsertRentalRequest(
          nft,
          100,
          [PeriodOption.ONE_WEEK],
          1976562675847,
          UpsertRentalOptType.INSERT
        )
      ],
      data: {},
      error: null,
      isSubmittingTransaction: false
    }
  })
  it('should remove the loading action', () => {
    const newState = rentalReducer(
      state,
      upsertRentalFailure(
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
      upsertRentalFailure(
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
        claimAssetTransactionSubmitted(nft, 'aTxHash', 'aRentalContractAddress')
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
    expect(rentalReducer(rentalState, claimAssetRequest(nft, rental))).toEqual({
      ...rentalState,
      isSubmittingTransaction: true,
      loading: [claimAssetRequest(nft, rental)],
      error: null
    })
  })
})

describe('when reducing the action the success of claiming a LAND', () => {
  beforeEach(() => {
    rentalState = {
      ...rentalState,
      data: {
        [rental.id]: rental
      },
      isSubmittingTransaction: true,
      loading: [claimAssetRequest(nft, rental)],
      error: 'anError'
    }
  })

  it('should remove the loading and the rental, set the submitting transaction flag as false and clear the error', () => {
    expect(rentalReducer(rentalState, claimAssetSuccess(nft, rental))).toEqual({
      ...rentalState,
      data: {},
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
      loading: [claimAssetRequest(nft, rental)],
      isSubmittingTransaction: true,
      error: null
    }
  })

  it("should remove the loading, set the submitting transaction flag to false, set the error with the action's error", () => {
    expect(rentalReducer(rentalState, claimAssetFailure('anError'))).toEqual({
      ...rentalState,
      loading: [],
      isSubmittingTransaction: false,
      error: 'anError'
    })
  })
})

describe('when reducing the action of the start of a rental removal', () => {
  beforeEach(() => {
    rentalState = {
      ...rentalState,
      isSubmittingTransaction: false,
      loading: [],
      error: 'anError'
    }
  })

  it('should set the action into loading, the submitting transaction flag as true and clear the error', () => {
    expect(rentalReducer(rentalState, removeRentalRequest(nft))).toEqual({
      ...rentalState,
      isSubmittingTransaction: true,
      loading: [removeRentalRequest(nft)],
      error: null
    })
  })
})

describe('when reducing the action the success of removing a rental', () => {
  beforeEach(() => {
    rentalState = {
      ...rentalState,
      data: {
        [rental.id]: rental
      },
      isSubmittingTransaction: true,
      loading: [removeRentalRequest(nft)],
      error: 'anError'
    }
  })

  it('should remove the loading and the rental, set the submitting transaction flag as false and clear the error', () => {
    expect(rentalReducer(rentalState, removeRentalSuccess(nft))).toEqual({
      ...rentalState,
      data: {},
      isSubmittingTransaction: false,
      loading: [],
      error: null
    })
  })
})

describe('when reducing the failure action of removing a rental', () => {
  beforeEach(() => {
    rentalState = {
      ...rentalState,
      loading: [removeRentalRequest(nft)],
      isSubmittingTransaction: true,
      error: null
    }
  })

  it("should remove the loading, set the submitting transaction flag to false, set the error with the action's error", () => {
    expect(rentalReducer(rentalState, removeRentalFailure('anError'))).toEqual({
      ...rentalState,
      loading: [],
      isSubmittingTransaction: false,
      error: 'anError'
    })
  })
})

describe('when reducing the action of the start of an accept rental listing', () => {
  let periodIndexChosen: number
  let addressOperator: string
  beforeEach(() => {
    periodIndexChosen = 0
    addressOperator = '0xoperator'
    rentalState = {
      ...rentalState,
      isSubmittingTransaction: false,
      loading: [],
      error: 'anError'
    }
  })

  it('should set the action into loading, the submitting transaction flag as true and clear the error', () => {
    expect(
      rentalReducer(
        rentalState,
        acceptRentalListingRequest(
          nft,
          rental,
          periodIndexChosen,
          addressOperator
        )
      )
    ).toEqual({
      ...rentalState,
      isSubmittingTransaction: true,
      loading: [
        acceptRentalListingRequest(
          nft,
          rental,
          periodIndexChosen,
          addressOperator
        )
      ],
      error: null
    })
  })
})

describe('when reducing the action the success of accepting a rental', () => {
  let periodIndexChosen: number
  let addressOperator: string
  let updatedRental: RentalListing
  beforeEach(() => {
    periodIndexChosen = 0
    addressOperator = '0xoperator'
    rentalState = {
      ...rentalState,
      data: {
        [rental.id]: rental
      },
      isSubmittingTransaction: true,
      loading: [
        acceptRentalListingRequest(
          nft,
          rental,
          periodIndexChosen,
          addressOperator
        )
      ],
      error: 'anError'
    }
    updatedRental = { ...rental, status: RentalStatus.EXECUTED }
  })

  it('should set the submitting transaction flag as false, clear the error and put the updated listing in the data', () => {
    expect(
      rentalReducer(
        rentalState,
        acceptRentalListingSuccess(nft, updatedRental, periodIndexChosen)
      )
    ).toEqual({
      ...rentalState,
      data: {
        [rental.id]: updatedRental
      },
      isSubmittingTransaction: false,
      loading: [],
      error: null
    })
  })
})

describe('when reducing the action that signals that the accept listing transaction was submitted', () => {
  let periodIndexChosen: number
  beforeEach(() => {
    rentalState = {
      ...rentalState,
      isSubmittingTransaction: true
    }
    periodIndexChosen = 0
  })

  it('should set the flag that defines that the transaction is being submitted to false', () => {
    expect(
      rentalReducer(
        rentalState,
        acceptRentalListingTransactionSubmitted(
          nft,
          rental,
          'aTxHash',
          periodIndexChosen
        )
      )
    ).toEqual({
      ...rentalState,
      isSubmittingTransaction: false
    })
  })
})

describe('when reducing the failure action of accepting a rental', () => {
  let periodIndexChosen: number
  let addressOperator: string
  beforeEach(() => {
    periodIndexChosen = 0
    addressOperator = '0xoperator'
    rentalState = {
      ...rentalState,
      loading: [
        acceptRentalListingRequest(
          nft,
          rental,
          periodIndexChosen,
          addressOperator
        )
      ],
      isSubmittingTransaction: true,
      error: null
    }
  })

  it("should remove the loading, set the submitting transaction flag to false, set the error with the action's error", () => {
    expect(
      rentalReducer(rentalState, acceptRentalListingFailure('anError'))
    ).toEqual({
      ...rentalState,
      loading: [],
      isSubmittingTransaction: false,
      error: 'anError'
    })
  })
})
