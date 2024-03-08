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
export const upsertRentalSuccess = (nft: NFT, rental: RentalListing, operationType: UpsertRentalOptType) =>
  action(UPSERT_RENTAL_SUCCESS, {
    nft,
    rental,
    operationType
  })
export const upsertRentalFailure = (nft: NFT, pricePerDay: number, periods: PeriodOption[], expiresAt: number, error: string) =>
  action(UPSERT_RENTAL_FAILURE, { nft, pricePerDay, periods, expiresAt, error })

export type UpsertRentalRequestAction = ReturnType<typeof upsertRentalRequest>
export type UpsertRentalSuccessAction = ReturnType<typeof upsertRentalSuccess>
export type UpsertRentalFailureAction = ReturnType<typeof upsertRentalFailure>

export const CLAIM_ASSET_REQUEST = '[Request] Claim Asset'
export const CLAIM_ASSET_SUCCESS = '[Success] Claim Asset'
export const CLAIM_ASSET_FAILURE = '[Failure] Claim Asset'
export const CLAIM_ASSET_TRANSACTION_SUBMITTED = '[Submitted transaction] Claim Asset'

export const claimAssetRequest = (nft: NFT, rental: RentalListing) => action(CLAIM_ASSET_REQUEST, { nft, rental })
export const claimAssetSuccess = (nft: NFT, rental: RentalListing) =>
  action(CLAIM_ASSET_SUCCESS, {
    nft,
    rental
  })
export const claimAssetFailure = (error: string) => action(CLAIM_ASSET_FAILURE, { error })
export const claimAssetTransactionSubmitted = (nft: NFT, txHash: string, rentalContractAddress: string) =>
  action(
    CLAIM_ASSET_TRANSACTION_SUBMITTED,
    buildTransactionPayload(nft.chainId, txHash, {
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      rentalContractAddress,
      chainId: nft.chainId
    })
  )

export type ClaimAssetRequestAction = ReturnType<typeof claimAssetRequest>
export type ClaimAssetSuccessAction = ReturnType<typeof claimAssetSuccess>
export type ClaimAssetFailureAction = ReturnType<typeof claimAssetFailure>
export type ClaimAssetTransactionSubmitted = ReturnType<typeof claimAssetTransactionSubmitted>

export const CLEAR_RENTAL_ERRORS = 'Clear rental errors'

export const clearRentalErrors = () => action(CLEAR_RENTAL_ERRORS)

export type ClearRentalErrorsAction = ReturnType<typeof clearRentalErrors>

export const REMOVE_RENTAL_REQUEST = '[Request] Remove Rental'
export const REMOVE_RENTAL_SUCCESS = '[Success] Remove Rental'
export const REMOVE_RENTAL_FAILURE = '[Failure] Remove Rental'
export const REMOVE_RENTAL_TRANSACTION_SUBMITTED = '[Submitted transaction] Remove Rental'

export const removeRentalRequest = (nft: NFT) => action(REMOVE_RENTAL_REQUEST, { nft })
export const removeRentalSuccess = (nft: NFT) =>
  action(REMOVE_RENTAL_SUCCESS, {
    nft
  })
export const removeRentalFailure = (error: string) => action(REMOVE_RENTAL_FAILURE, { error })
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
export type RemoveRentalTransactionSubmitted = ReturnType<typeof removeRentalTransactionSubmitted>

export const ACCEPT_RENTAL_LISTING_REQUEST = '[Request] Accept Rental Listing'
export const ACCEPT_RENTAL_LISTING_SUCCESS = '[Success] Accept Rental Listing'
export const ACCEPT_RENTAL_LISTING_FAILURE = '[Failure] Accept Rental Listing'
export const ACCEPT_RENTAL_LISTING_TRANSACTION_SUBMITTED = '[Submitted transaction] Accept Rental Listing'

export const acceptRentalListingRequest = (nft: NFT, rental: RentalListing, periodIndexChosen: number, addressOperator: string) =>
  action(ACCEPT_RENTAL_LISTING_REQUEST, {
    nft,
    rental,
    periodIndexChosen,
    addressOperator
  })
export const acceptRentalListingSuccess = (nft: NFT, rental: RentalListing, periodIndexChosen: number) =>
  action(ACCEPT_RENTAL_LISTING_SUCCESS, {
    nft,
    periodIndexChosen,
    rental
  })
export const acceptRentalListingFailure = (error: string) => action(ACCEPT_RENTAL_LISTING_FAILURE, { error })
export const acceptRentalListingTransactionSubmitted = (nft: NFT, rental: RentalListing, txHash: string, periodIndexChosen: number) =>
  action(
    ACCEPT_RENTAL_LISTING_TRANSACTION_SUBMITTED,
    buildTransactionPayload(nft.chainId, txHash, {
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      pricePerDay: rental.periods[periodIndexChosen].pricePerDay,
      duration: rental.periods[periodIndexChosen].maxDays
    })
  )

export type AcceptRentalListingRequestAction = ReturnType<typeof acceptRentalListingRequest>
export type AcceptRentalListingSuccessAction = ReturnType<typeof acceptRentalListingSuccess>
export type AcceptRentalListingFailureAction = ReturnType<typeof acceptRentalListingFailure>
export type AcceptRentalListingTransactionSubmitted = ReturnType<typeof acceptRentalListingTransactionSubmitted>
