import { takeEvery, call, put, select } from 'redux-saga/effects'
import { ErrorCode } from 'decentraland-transactions'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from '../../lib/error'
import { getWallet } from '../wallet/selectors'
import { Vendor, VendorFactory } from '../vendor/VendorFactory'
import { getContract, getContracts } from '../contract/selectors'
import { VendorName } from '../vendor/types'
import { AwaitFn } from '../types'
import { getOrWaitForContracts } from '../contract/utils'
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
  transferNFTFailure
} from './actions'
import { NFT } from './types'

export function* nftSaga() {
  yield takeEvery(FETCH_NFTS_REQUEST, handleFetchNFTsRequest)
  yield takeEvery(FETCH_NFT_REQUEST, handleFetchNFTRequest)
  yield takeEvery(TRANSFER_NFT_REQUEST, handleTransferNFTRequest)
}

function* handleFetchNFTsRequest(action: FetchNFTsRequestAction) {
  const { options, timestamp } = action.payload
  const { vendor: VendorName, filters } = options
  const contracts: ReturnType<typeof getContracts> = yield select(getContracts)

  const params = {
    ...DEFAULT_BASE_NFT_PARAMS,
    ...action.payload.options.params,
    contracts
  }

  try {
    const vendor: Vendor<VendorName> = yield call(
      VendorFactory.build,
      VendorName
    )

    const [
      nfts,
      accounts,
      orders,
      rentals,
      count
    ]: AwaitFn<typeof vendor.nftService.fetch> = yield call(
      [vendor.nftService, 'fetch'],
      params,
      filters
    )

    yield put(
      fetchNFTsSuccess(
        options,
        nfts as NFT[],
        accounts,
        orders,
        rentals,
        count,
        timestamp
      )
    )
  } catch (error) {
    yield put(fetchNFTsFailure(options, (error as Error).message, timestamp))
  }
}

function* handleFetchNFTRequest(action: FetchNFTRequestAction) {
  const { contractAddress, tokenId, options } = action.payload

  try {
    yield call(getOrWaitForContracts)

    const contract: ReturnType<typeof getContract> = yield select(getContract, {
      address: contractAddress
    })

    if (!contract || !contract.vendor) {
      throw new Error(
        `Couldn't find a valid vendor for contract ${contract?.address}`
      )
    }

    const vendor: Vendor<VendorName> = yield call(
      VendorFactory.build,
      contract.vendor
    )

    const [
      nft,
      order,
      rental
    ]: AwaitFn<typeof vendor.nftService.fetchOne> = yield call(
      [vendor.nftService, 'fetchOne'],
      contractAddress,
      tokenId,
      options
    )

    yield put(fetchNFTSuccess(nft as NFT, order, rental))
  } catch (error) {
    yield put(
      fetchNFTFailure(contractAddress, tokenId, (error as Error).message)
    )
  }
}

function* handleTransferNFTRequest(action: TransferNFTRequestAction) {
  const { nft, address } = action.payload
  try {
    const vendor: Vendor<VendorName> = yield call(
      VendorFactory.build,
      nft.vendor
    )

    const wallet: ReturnType<typeof getWallet> = yield select(getWallet)
    if (!wallet) {
      throw new Error('A wallet is needed to perform a NFT transfer request')
    }

    const txHash: string = yield call(
      [vendor.nftService, 'transfer'],
      wallet,
      address,
      nft
    )

    yield put(transferNFTSuccess(nft, address, txHash))
  } catch (error) {
    const errorMessage = isErrorWithMessage(error)
      ? error.message
      : t('global.unknown_error')
    const errorCode =
      error !== undefined &&
      error !== null &&
      typeof error === 'object' &&
      'code' in error
        ? (error as { code: ErrorCode }).code
        : undefined
    yield put(transferNFTFailure(nft, address, errorMessage, errorCode))
  }
}
