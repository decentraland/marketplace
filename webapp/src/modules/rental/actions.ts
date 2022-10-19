import { RentalListing } from '@dcl/schemas'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'
import { action } from 'typesafe-actions'
import { NFT } from '../nft/types'
import { PeriodOption, UpsertRentalOptType } from './types'

export const UPSERT_RENTAL_REQUEST = '[Request] Upsert Rental'
export const UPSERT_RENTAL_SUCCESS = '[Success] Upsert Rental'
export const UPSERT_RENTAL_FAILURE = '[Failure] Upsert Rental'

export const upsertRentalRequest = (
  nft: NFT,
  pricePerDay: number,
  periods: PeriodOption[],
  expiresAt: number,
  operationType: UpsertRentalOptType
) =>
  action(UPSERT_RENTAL_REQUEST, {
    nft,
    pricePerDay,
    periods,
    expiresAt,
    operationType
  })
export const upsertRentalSuccess = (
  nft: NFT,
  rental: RentalListing,
  operationType: UpsertRentalOptType
) =>
  action(UPSERT_RENTAL_SUCCESS, {
    nft,
    rental,
    operationType
  })
export const upsertRentalFailure = (
  nft: NFT,
  pricePerDay: number,
  periods: PeriodOption[],
  expiresAt: number,
  error: string
) =>
  action(UPSERT_RENTAL_FAILURE, { nft, pricePerDay, periods, expiresAt, error })

export type UpsertRentalRequestAction = ReturnType<typeof upsertRentalRequest>
export type UpsertRentalSuccessAction = ReturnType<typeof upsertRentalSuccess>
export type UpsertRentalFailureAction = ReturnType<typeof upsertRentalFailure>

export const CLAIM_LAND_REQUEST = '[Request] Claim LAND'
export const CLAIM_LAND_SUCCESS = '[Success] Claim LAND'
export const CLAIM_LAND_FAILURE = '[Failure] Claim LAND'
export const CLAIM_LAND_TRANSACTION_SUBMITTED =
  '[Submitted transaction] Claim LAND'

export const claimLandRequest = (nft: NFT, rental: RentalListing) =>
  action(CLAIM_LAND_REQUEST, { nft, rental })
export const claimLandSuccess = (nft: NFT, rental: RentalListing) =>
  action(CLAIM_LAND_SUCCESS, {
    nft,
    rental
  })
export const claimLandFailure = (error: string) =>
  action(CLAIM_LAND_FAILURE, { error })
export const claimLandTransactionSubmitted = (
  nft: NFT,
  txHash: string,
  rentalContractAddress: string
) =>
  action(
    CLAIM_LAND_TRANSACTION_SUBMITTED,
    buildTransactionPayload(nft.chainId, txHash, {
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      rentalContractAddress,
      chainId: nft.chainId
    })
  )

export type ClaimLandRequestAction = ReturnType<typeof claimLandRequest>
export type ClaimLandSuccessAction = ReturnType<typeof claimLandSuccess>
export type ClaimLandFailureAction = ReturnType<typeof claimLandFailure>
export type ClaimLandTransactionSubmitted = ReturnType<
  typeof claimLandTransactionSubmitted
>

export const CLEAR_RENTAL_ERRORS = 'Clear rental errors'

export const clearRentalErrors = () => action(CLEAR_RENTAL_ERRORS)

export type ClearRentalErrors = ReturnType<typeof clearRentalErrors>

export const REMOVE_RENTAL_REQUEST = '[Request] Remove Rental'
export const REMOVE_RENTAL_SUCCESS = '[Success] Remove Rental'
export const REMOVE_RENTAL_FAILURE = '[Failure] Remove Rental'
export const REMOVE_RENTAL_TRANSACTION_SUBMITTED =
  '[Submitted transaction] Remove Rental'

export const removeRentalRequest = (nft: NFT) =>
  action(REMOVE_RENTAL_REQUEST, { nft })
export const removeRentalSuccess = (nft: NFT) =>
  action(REMOVE_RENTAL_SUCCESS, {
    nft
  })
export const removeRentalFailure = (error: string) =>
  action(REMOVE_RENTAL_FAILURE, { error })
export const removeRentalTransactionSubmitted = (nft: NFT, txHash: string) =>
  action(
    REMOVE_RENTAL_TRANSACTION_SUBMITTED,
    buildTransactionPayload(nft.chainId, txHash, {
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress
    })
  )

export type RemoveRentalRequestAction = ReturnType<typeof removeRentalRequest>
export type RemoveRentalSuccessAction = ReturnType<typeof removeRentalSuccess>
export type RemoveRentalFailureAction = ReturnType<typeof removeRentalFailure>
export type RemoveRentalTransactionSubmitted = ReturnType<
  typeof removeRentalTransactionSubmitted
>

export const ACCEPT_RENTAL_LISTING_REQUEST = '[Request] Accept Rental Listing'
export const ACCEPT_RENTAL_LISTING_SUCCESS = '[Success] Accept Rental Listing'
export const ACCEPT_RENTAL_LISTING_FAILURE = '[Failure] Accept Rental Listing'
export const ACCEPT_RENTAL_LISTING_TRANSACTION_SUBMITTED =
  '[Submitted transaction] Accept Rental Listing'

export const acceptRentalListingRequest = (
  nft: NFT,
  rental: RentalListing,
  periodIndexChosen: number,
  addressOperator: string
) =>
  action(ACCEPT_RENTAL_LISTING_REQUEST, {
    nft,
    rental,
    periodIndexChosen,
    addressOperator
  })
export const acceptRentalListingSuccess = (nft: NFT) =>
  action(ACCEPT_RENTAL_LISTING_SUCCESS, {
    nft
  })
export const acceptRentalListingFailure = (error: string) =>
  action(ACCEPT_RENTAL_LISTING_FAILURE, { error })
export const acceptRentalListingTransactionSubmitted = (
  nft: NFT,
  txHash: string
) =>
  action(
    ACCEPT_RENTAL_LISTING_TRANSACTION_SUBMITTED,
    buildTransactionPayload(nft.chainId, txHash, {
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress
    })
  )

export type AcceptRentalListingRequestAction = ReturnType<
  typeof acceptRentalListingRequest
>
export type AcceptRentalListingSuccessAction = ReturnType<
  typeof acceptRentalListingSuccess
>
export type AcceptRentalListingFailureAction = ReturnType<
  typeof acceptRentalListingFailure
>
export type AcceptRentalListingTransactionSubmitted = ReturnType<
  typeof acceptRentalListingTransactionSubmitted
>
