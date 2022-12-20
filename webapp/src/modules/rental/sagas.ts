import {
  NFT,
  NFTCategory,
  PeriodCreation,
  RentalListing,
  RentalListingCreation,
  RentalStatus
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
import { call, delay, put, select, take, takeEvery } from 'redux-saga/effects'
import { getIdentity } from '../identity/utils'
import { rentalsAPI } from '../vendor/decentraland/rentals/api'
import { getAddress } from '../wallet/selectors'
import { getContract as getContractByQuery } from '../contract/selectors'
import { getFingerprint } from '../nft/estate/utils'
import { CloseModalAction, CLOSE_MODAL } from '../modal/actions'
import { addressEquals } from '../wallet/utils'
import { fetchNFTRequest, FETCH_NFT_SUCCESS } from '../nft/actions'
import { getCurrentNFT } from '../nft/selectors'
import {
  claimAssetFailure,
  ClaimAssetRequestAction,
  claimAssetTransactionSubmitted,
  claimAssetSuccess,
  CLAIM_ASSET_REQUEST,
  clearRentalErrors,
  upsertRentalFailure,
  UpsertRentalRequestAction,
  upsertRentalSuccess,
  UPSERT_RENTAL_REQUEST,
  RemoveRentalRequestAction,
  removeRentalFailure,
  removeRentalSuccess,
  removeRentalTransactionSubmitted,
  REMOVE_RENTAL_REQUEST,
  ACCEPT_RENTAL_LISTING_REQUEST,
  AcceptRentalListingRequestAction,
  acceptRentalListingSuccess,
  acceptRentalListingFailure,
  acceptRentalListingTransactionSubmitted
} from './actions'
import {
  daysByPeriod,
  generateECDSASignatureWithValidV,
  getNonces,
  getSignature,
  waitUntilRentalChangesStatus
} from './utils'

export function* rentalSaga() {
  yield takeEvery(UPSERT_RENTAL_REQUEST, handleCreateOrEditRentalRequest)
  yield takeEvery(CLAIM_ASSET_REQUEST, handleClaimLandRequest)
  yield takeEvery(CLOSE_MODAL, handleModalClose)
  yield takeEvery(REMOVE_RENTAL_REQUEST, handleRemoveRentalRequest)
  yield takeEvery(
    ACCEPT_RENTAL_LISTING_REQUEST,
    handleAcceptRentalListingRequest
  )
}

function* handleCreateOrEditRentalRequest(action: UpsertRentalRequestAction) {
  const { nft, pricePerDay, expiresAt, operationType } = action.payload

  const periods: PeriodCreation[] = action.payload.periods.map(period => ({
    maxDays: daysByPeriod[period],
    minDays: daysByPeriod[period],
    pricePerDay: ethers.utils.parseUnits(pricePerDay.toString()).toString()
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

    let signature: string = yield call(
      getSignature,
      nft.chainId,
      nft.contractAddress,
      nft.tokenId,
      nonces,
      periods,
      expiresAt
    )

    signature = yield call(generateECDSASignatureWithValidV, signature)

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
      signature,
      target: ethers.constants.AddressZero // For now, all rent listing will be "public", for all addresses to use.
    }

    const identity: AuthIdentity = yield getIdentity()

    const rental: RentalListing = yield call(
      [rentalsAPI, 'createRentalListing'],
      rentalListingCreation,
      identity
    )

    yield put(upsertRentalSuccess(nft, rental, operationType))
  } catch (error) {
    yield put(
      upsertRentalFailure(
        nft,
        pricePerDay,
        action.payload.periods,
        expiresAt,
        (error as Error).message
      )
    )
  }
}

function* handleClaimLandRequest(action: ClaimAssetRequestAction) {
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
      'claim(address[],uint256[])',
      [nft.contractAddress],
      [nft.tokenId]
    )
    yield put(
      claimAssetTransactionSubmitted(nft, txHash, rentalsContract.address)
    )
    yield call(waitForTx, txHash)
    yield call(waitUntilRentalChangesStatus, nft, RentalStatus.CLAIMED)
    let hasAssetBack = addressEquals(nft.owner, rental.lessor!)
    while (!hasAssetBack) {
      yield put(fetchNFTRequest(nft.contractAddress, nft.tokenId))
      yield take(FETCH_NFT_SUCCESS)
      const nftUpdated: NFT = yield select(getCurrentNFT)
      hasAssetBack = addressEquals(nftUpdated.owner, rental.lessor!)
      yield delay(5000)
    }
    yield put(claimAssetSuccess(nft, rental))
  } catch (error) {
    yield put(claimAssetFailure((error as Error).message))
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
    yield call(waitUntilRentalChangesStatus, nft, RentalStatus.CANCELLED)
    yield put(removeRentalSuccess(nft))
  } catch (error) {
    yield put(removeRentalFailure((error as Error).message))
  }
}

function* handleAcceptRentalListingRequest(
  action: AcceptRentalListingRequestAction
) {
  const { nft, rental, periodIndexChosen, addressOperator } = action.payload

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

    // the contract expects these as arrays of values
    const [pricePerDay, maxDays, minDays] = rental.periods.reduce(
      (acc, curr) => {
        acc[0].push(curr.pricePerDay)
        acc[1].push(curr.maxDays)
        acc[2].push(curr.minDays)
        return acc
      },
      [[], [], []] as [string[], number[], number[]]
    )

    const signature: string = yield call(
      generateECDSASignatureWithValidV,
      rental.signature
    )

    const listing = {
      signer: rental.lessor,
      contractAddress: rental.contractAddress,
      tokenId: rental.tokenId,
      expiration: (rental.expiration / 1000).toString(),
      indexes: rental.nonces,
      pricePerDay,
      maxDays,
      minDays,
      target: ethers.constants.AddressZero,
      signature
    }

    let fingerprint = ethers.utils.randomBytes(32).map(() => 0)
    if (nft.category === NFTCategory.ESTATE) {
      const estateContract: ReturnType<typeof getContractByQuery> = yield select(
        getContractByQuery,
        {
          category: NFTCategory.ESTATE
        }
      )
      if (estateContract) {
        fingerprint = yield call(getFingerprint, nft.tokenId, estateContract)
      }
    }

    const txParams = [
      Object.values(listing),
      addressOperator,
      periodIndexChosen,
      rental.periods[periodIndexChosen].maxDays,
      fingerprint
    ]

    const txHash: string = yield call(
      sendTransaction as (
        contract: ContractData,
        contractMethodName: string,
        ...contractArguments: any[]
      ) => Promise<string>,
      rentalsContract,
      'acceptListing((address,address,uint256,uint256,uint256[3],uint256[],uint256[],uint256[],address,bytes),address,uint256,uint256,bytes32)',
      ...txParams
    )
    yield put(
      acceptRentalListingTransactionSubmitted(
        nft,
        rental,
        txHash,
        periodIndexChosen
      )
    )
    yield call(waitForTx, txHash)
    const rentalListingUpdated: RentalListing = yield call(
      waitUntilRentalChangesStatus,
      nft,
      RentalStatus.EXECUTED
    )
    yield put(
      acceptRentalListingSuccess(nft, rentalListingUpdated, periodIndexChosen)
    )
  } catch (error) {
    yield put(acceptRentalListingFailure((error as Error).message))
  }
}
