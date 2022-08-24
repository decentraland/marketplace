import { RentalListing } from '@dcl/schemas'
import { action } from 'typesafe-actions'
import { NFT } from '../nft/types'
import { PeriodOption } from './types'

export const CREATE_RENTAL_REQUEST = '[Request] Create Rental'
export const CREATE_RENTAL_SUCCESS = '[Success] Create Rental'
export const CREATE_RENTAL_FAILURE = '[Failure] Create Rental'

export const createRentalRequest = (
  nft: NFT,
  pricePerDay: number,
  periods: PeriodOption[],
  expiresAt: number
) => action(CREATE_RENTAL_REQUEST, { nft, pricePerDay, periods, expiresAt })
export const createRentalSuccess = (nft: NFT, rental: RentalListing) =>
  action(CREATE_RENTAL_SUCCESS, {
    nft,
    rental
  })
export const createRentalFailure = (
  nft: NFT,
  pricePerDay: number,
  periods: PeriodOption[],
  expiresAt: number,
  error: string
) =>
  action(CREATE_RENTAL_FAILURE, { nft, pricePerDay, periods, expiresAt, error })

export type CreateRentalRequestAction = ReturnType<typeof createRentalRequest>
export type CreateRentalSuccessAction = ReturnType<typeof createRentalSuccess>
export type CreateRentalFailureAction = ReturnType<typeof createRentalFailure>
