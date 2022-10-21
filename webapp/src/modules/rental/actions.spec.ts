import { RentalListing } from '@dcl/schemas'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'
import { NFT } from '../nft/types'
import {
  acceptRentalListingFailure,
  acceptRentalListingRequest,
  acceptRentalListingSuccess,
  acceptRentalListingTransactionSubmitted,
  ACCEPT_RENTAL_LISTING_FAILURE,
  ACCEPT_RENTAL_LISTING_REQUEST,
  ACCEPT_RENTAL_LISTING_SUCCESS,
  ACCEPT_RENTAL_LISTING_TRANSACTION_SUBMITTED
} from './actions'

const anErrorMessage = 'An error'

describe('when creating the action to signal the start of the accept rental listing event', () => {
  let nft: NFT
  let rental: RentalListing
  let periodIndexChosen: number
  let addressOperator: string

  beforeEach(() => {
    nft = { id: 'aNftId' } as NFT
    rental = { id: 'aRentalId' } as RentalListing
    periodIndexChosen = 0
    addressOperator = '0xaddress'
  })
  it('should return an object representing the action', () => {
    expect(
      acceptRentalListingRequest(
        nft,
        rental,
        periodIndexChosen,
        addressOperator
      )
    ).toEqual({
      type: ACCEPT_RENTAL_LISTING_REQUEST,
      meta: undefined,
      payload: {
        nft,
        rental,
        periodIndexChosen,
        addressOperator
      }
    })
  })
})

describe('when creating the action to signal a success of the accept rental listing event', () => {
  let rental: RentalListing
  let periodIndexChosen: number

  beforeEach(() => {
    rental = { id: 'aRentalId' } as RentalListing
    periodIndexChosen = 0
  })

  it('should return an object representing the action', () => {
    expect(acceptRentalListingSuccess(rental, periodIndexChosen)).toEqual({
      type: ACCEPT_RENTAL_LISTING_SUCCESS,
      meta: undefined,
      payload: { rental, periodIndexChosen }
    })
  })
})

describe('when creating the action to signal of the accept rental listing event', () => {
  it('should return an object representing the action', () => {
    expect(acceptRentalListingFailure(anErrorMessage)).toEqual({
      type: ACCEPT_RENTAL_LISTING_FAILURE,
      meta: undefined,
      payload: { error: anErrorMessage }
    })
  })
})

describe('when creating the action to signal the submission of the accept rental listing transaction', () => {
  let nft: NFT
  let txHash: string

  beforeEach(() => {
    nft = { id: 'aNftId' } as NFT
    txHash = '0x123'
  })

  it('should return an object representing the action', () => {
    expect(acceptRentalListingTransactionSubmitted(nft, txHash)).toEqual({
      type: ACCEPT_RENTAL_LISTING_TRANSACTION_SUBMITTED,
      meta: undefined,
      payload: buildTransactionPayload(nft.chainId, txHash, {
        tokenId: nft.tokenId,
        contractAddress: nft.contractAddress
      })
    })
  })
})
