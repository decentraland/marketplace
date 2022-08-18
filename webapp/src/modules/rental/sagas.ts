import {
  PeriodCreation,
  RentalListing,
  RentalListingCreation
} from '@dcl/schemas'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import {
  ContractData,
  ContractName,
  getContract
} from 'decentraland-transactions'
import { ethers } from 'ethers'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { getIdentity } from '../identity/utils'
import { rentalsAPI } from '../vendor/decentraland/rentals/api'
import { getAddress } from '../wallet/selectors'
import {
  createRentalFailure,
  CreateRentalRequestAction,
  createRentalSuccess,
  CREATE_RENTAL_REQUEST
} from './actions'
import { daysByPeriod, getNonces, getSignature } from './utils'

export function* rentalSaga() {
  yield takeEvery(CREATE_RENTAL_REQUEST, handleCreateRentalRequest)
}

function* handleCreateRentalRequest(action: CreateRentalRequestAction) {
  const { nft, pricePerDay, expiresAt } = action.payload

  const periods: PeriodCreation[] = action.payload.periods.map(period => ({
    maxDays: daysByPeriod[period],
    minDays: daysByPeriod[period],
    pricePerDay: ethers.utils.parseUnits('100', 18).toString()
  }))

  try {
    const address: string | undefined = yield select(getAddress)
    if (!address) {
      throw new Error(`Invalid address`)
    }

    const nonces: string[] = yield call(
      getNonces,
      nft.chainId,
      nft.contractAddress,
      nft.tokenId,
      address
    )

    const signature: string = yield call(
      getSignature,
      nft.chainId,
      nft.contractAddress,
      nft.tokenId,
      nonces,
      periods,
      expiresAt
    )

    const rentalsContract: ContractData = getContract(
      ContractName.Rentals,
      nft.chainId
    )

    const rentalListingCreation: RentalListingCreation = {
      chainId: nft.chainId,
      contractAddress: nft.contractAddress,
      tokenId: nft.tokenId,
      network: nft.network,
      expiration: expiresAt,
      rentalContractAddress: rentalsContract.address,
      nonces,
      periods,
      signature
    }

    const identity: AuthIdentity = yield getIdentity()

    const rental: RentalListing = yield call(
      [rentalsAPI, 'createRentalListing'],
      rentalListingCreation,
      identity
    )

    yield put(createRentalSuccess(nft, rental))
  } catch (error) {
    yield put(
      createRentalFailure(
        nft,
        pricePerDay,
        action.payload.periods,
        expiresAt,
        error.message
      )
    )
  }
}
