import { takeEvery, call, put, select } from 'redux-saga/effects'
import { RentalListing, RentalStatus } from '@dcl/schemas'
import { ErrorCode } from 'decentraland-transactions'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from '../../lib/error'
import { getWallet } from '../wallet/selectors'
import { Vendor, VendorFactory } from '../vendor/VendorFactory'
import { getContract, getContracts } from '../contract/selectors'
import { VendorName } from '../vendor/types'
import { AwaitFn } from '../types'
import { getContractKey, getContractKeyFromNFT, getStubMaticCollectionContract } from '../contract/utils'
import { getRentalById } from '../rental/selectors'
import { isRentalListingOpen, waitUntilRentalChangesStatus } from '../rental/utils'
import { upsertContracts } from '../contract/actions'
import { Contract } from '../vendor/services'
import { retryParams } from '../vendor/decentraland/utils'
import { fetchSmartWearableRequiredPermissionsRequest } from '../asset/actions'
import {
  DEFAULT_BASE_NFT_PARAMS,
  FETCH_NFTS_REQUEST,
  FetchNFTsRequestAction,
  fetchNFTsSuccess,
  fetchNFTsFailure,
  FETCH_NFT_REQUEST,
  FetchNFTRequestAction,
  fetchNFTSuccess,
  fetchNFTFailure,
  TRANSFER_NFT_REQUEST,
  TransferNFTRequestAction,
  transferNFTSuccess,
  transferNFTFailure,
  transferNFTransactionSubmitted
} from './actions'
import { NFT } from './types'

export function* nftSaga(getIdentity: () => AuthIdentity | undefined) {
  const API_OPTS = {
    retries: retryParams.attempts,
    retryDelay: retryParams.delay,
    identity: getIdentity
  }

  yield takeEvery(FETCH_NFTS_REQUEST, handleFetchNFTsRequest)
  yield takeEvery(FETCH_NFT_REQUEST, handleFetchNFTRequest)
  yield takeEvery(TRANSFER_NFT_REQUEST, handleTransferNFTRequest)

  function* handleFetchNFTsRequest(action: FetchNFTsRequestAction) {
    const { options, timestamp } = action.payload
    const { vendor: vendorName, filters } = options

    const params = {
      ...DEFAULT_BASE_NFT_PARAMS,
      ...action.payload.options.params
    }

    try {
      const vendor: Vendor<VendorName> = yield call([VendorFactory, 'build'], vendorName, API_OPTS)

      const [nfts, accounts, orders, rentals, count]: AwaitFn<typeof vendor.nftService.fetch> = yield call(
        [vendor.nftService, 'fetch'],
        params,
        filters
      )

      const contracts: Contract[] = yield select(getContracts)

      const contractKeys = new Set(contracts.map(getContractKey))

      // From the obtained nfts, it will check if there are contracts stored for each of them.
      // Any nft that doesn't have a matching contract will have a stub one created and stored
      // So it can be used on the rest of the application.
      // Only wearables and emotes will have a stub contract created.
      const newContracts = nfts.reduce((arr, nft) => {
        const contractKeyFromNFT = getContractKeyFromNFT(nft)

        if (!contractKeys.has(contractKeyFromNFT)) {
          arr.push(getStubMaticCollectionContract(nft.contractAddress))
        }

        return arr
      }, [] as Contract[])

      if (newContracts.length > 0) {
        yield put(upsertContracts(newContracts))
      }

      yield put(fetchNFTsSuccess(options, nfts as NFT[], accounts, orders, rentals, count, timestamp))
    } catch (error) {
      yield put(fetchNFTsFailure(options, (error as Error).message, timestamp))
    }
  }
  function* handleFetchNFTRequest(action: FetchNFTRequestAction) {
    const { contractAddress, tokenId, options } = action.payload

    try {
      let contract: ReturnType<typeof getContract> = yield select(getContract, {
        address: contractAddress.toLowerCase()
      })

      // If the contract is not present in the state, it means that it is a wearable/emote.
      // In this case, a stub contract is created and added to the state so it can be used
      // on the rest of the application.
      if (!contract) {
        contract = getStubMaticCollectionContract(contractAddress)

        yield put(upsertContracts([contract]))
      }

      if (!contract.vendor) {
        throw new Error(`Couldn't find a valid vendor for contract ${contract?.address}`)
      }

      const vendor: Vendor<VendorName> = yield call([VendorFactory, 'build'], contract.vendor, API_OPTS)

      const [nft, order, rental]: AwaitFn<typeof vendor.nftService.fetchOne> = yield call(
        [vendor.nftService, 'fetchOne'],
        contractAddress,
        tokenId,
        options
      )

      yield put(fetchNFTSuccess(nft as NFT, order, rental))
      if (nft.data?.wearable?.isSmart && nft.urn) {
        yield put(fetchSmartWearableRequiredPermissionsRequest(nft as NFT))
      }
    } catch (error) {
      yield put(fetchNFTFailure(contractAddress, tokenId, (error as Error).message))
    }
  }

  function* handleTransferNFTRequest(action: TransferNFTRequestAction) {
    const { nft, address } = action.payload
    try {
      const vendor: Vendor<VendorName> = yield call([VendorFactory, 'build'], nft.vendor)

      const wallet: ReturnType<typeof getWallet> = yield select(getWallet)
      if (!wallet) {
        throw new Error('A wallet is needed to perform a NFT transfer request')
      }

      const txHash: string = yield call([vendor.nftService, 'transfer'], wallet, address, nft)
      yield put(transferNFTransactionSubmitted(nft, address, txHash))
      if (nft?.openRentalId) {
        yield call(waitForTx, txHash)
        const rental: RentalListing | null = yield select(getRentalById, nft.openRentalId)
        if (isRentalListingOpen(rental)) {
          yield call(waitUntilRentalChangesStatus, nft, RentalStatus.CANCELLED)
        }
      }

      yield put(transferNFTSuccess(nft, address))
    } catch (error) {
      const errorMessage = isErrorWithMessage(error) ? error.message : t('global.unknown_error')
      const errorCode =
        error !== undefined && error !== null && typeof error === 'object' && 'code' in error
          ? (error as { code: ErrorCode }).code
          : undefined
      yield put(transferNFTFailure(nft, address, errorMessage, errorCode))
    }
  }
}
