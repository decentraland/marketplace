import {
  PeriodCreation,
  RentalListing,
  RentalListingCreation
} from '@dcl/schemas'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import {
  ContractData,
  ContractName,
  getContract,
  Provider
} from 'decentraland-transactions'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { ethers } from 'ethers'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { getIdentity } from '../identity/utils'
import { rentalsAPI } from '../vendor/decentraland/rentals/api'
import { getAddress } from '../wallet/selectors'
import { CloseModalAction, CLOSE_MODAL } from '../modal/actions'
import {
  claimLandFailure,
  ClaimLandRequestAction,
  claimLandTransactionSubmitted,
  claimLandSuccess,
  CLAIM_LAND_REQUEST,
  clearRentalErrors,
  createRentalFailure,
  CreateRentalRequestAction,
  createRentalSuccess,
  CREATE_RENTAL_REQUEST,
  RemoveRentalRequestAction,
  removeRentalFailure,
  removeRentalSuccess,
  removeRentalTransactionSubmitted,
  REMOVE_RENTAL_REQUEST
} from './actions'
import { daysByPeriod, getNonces, getSignature } from './utils'

export function* rentalSaga() {
  yield takeEvery(CREATE_RENTAL_REQUEST, handleCreateRentalRequest)
  yield takeEvery(CLAIM_LAND_REQUEST, handleClaimLandRequest)
  yield takeEvery(CLOSE_MODAL, handleModalClose)
  yield takeEvery(REMOVE_RENTAL_REQUEST, handleRemoveRentalRequest)
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
        (error as Error).message
      )
    )
  }
}

function* handleClaimLandRequest(action: ClaimLandRequestAction) {
  const { nft, rental } = action.payload

  try {
    const provider: Provider | null = yield call(getConnectedProvider)
    if (!provider) {
      throw new Error('A provider is required to claim LAND')
    }

    const address: string | undefined = yield select(getAddress)
    if (!address) {
      throw new Error('An address is required to claim LAND')
    }

    const rentalsContract: ContractData = yield call(
      getContract,
      ContractName.Rentals,
      nft.chainId
    )

    const txHash: string = yield call(
      sendTransaction as (
        contract: ContractData,
        contractMethodName: string,
        ...contractArguments: any[]
      ) => Promise<string>,
      rentalsContract,
      'claim(address,uint256)',
      nft.contractAddress,
      nft.tokenId
    )
    yield put(
      claimLandTransactionSubmitted(nft, txHash, rentalsContract.address)
    )
    yield call(waitForTx, txHash)
    yield put(claimLandSuccess(nft, rental))
  } catch (error) {
    yield put(claimLandFailure((error as Error).message))
  }
}

function* handleModalClose(action: CloseModalAction) {
  if (
    action.payload.name === 'ClaimLandModal' ||
    action.payload.name === 'RemoveRentalModal'
  ) {
    yield put(clearRentalErrors())
  }
}

function* handleRemoveRentalRequest(action: RemoveRentalRequestAction) {
  const { nft } = action.payload

  try {
    if (!nft.openRentalId) {
      throw new Error('The provided NFT does not have an open rental')
    }

    const provider: Provider | null = yield call(getConnectedProvider)
    if (!provider) {
      throw new Error('A provider is required to remove a rental')
    }

    const address: string | undefined = yield select(getAddress)
    if (!address) {
      throw new Error('An address is required to remove a rental')
    }

    const rentalsContract: ContractData = yield call(
      getContract,
      ContractName.Rentals,
      nft.chainId
    )

    const txHash: string = yield call(
      sendTransaction as (
        contract: ContractData,
        contractMethodName: string,
        ...contractArguments: any[]
      ) => Promise<string>,
      rentalsContract,
      'bumpAssetIndex(address,uint256)',
      nft.contractAddress,
      nft.tokenId
    )
    yield put(removeRentalTransactionSubmitted(nft, txHash))
    yield call(waitForTx, txHash)
    yield call([rentalsAPI, 'refreshRentalListing'], nft.openRentalId)
    yield put(removeRentalSuccess(nft))
  } catch (error) {
    yield put(removeRentalFailure((error as Error).message))
  }
}
