import { takeEvery, call, put, select } from 'redux-saga/effects'
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
import { getWallet } from '../wallet/selectors'
import { Vendor, VendorFactory } from '../vendor/VendorFactory'
import { AwaitFn } from '../types'
import { getContract } from '../contract/utils'
import { NFT } from './types'
import { VendorName } from '../vendor/types'

export function* nftSaga() {
  yield takeEvery(FETCH_NFTS_REQUEST, handleFetchNFTsRequest)
  yield takeEvery(FETCH_NFT_REQUEST, handleFetchNFTRequest)
  yield takeEvery(TRANSFER_NFT_REQUEST, handleTransferNFTRequest)
}

function* handleFetchNFTsRequest(action: FetchNFTsRequestAction) {
  const { options, timestamp } = action.payload
  const { vendor: VendorName, filters } = options
  const params = {
    ...DEFAULT_BASE_NFT_PARAMS,
    ...action.payload.options.params
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
        count,
        timestamp
      )
    )
  } catch (error) {
    yield put(fetchNFTsFailure(options, error.message, timestamp))
  }
}

function* handleFetchNFTRequest(action: FetchNFTRequestAction) {
  const { contractAddress, tokenId } = action.payload

  try {
    const contract: ReturnType<typeof getContract> = yield call(getContract, {
      address: contractAddress
    })
    if (!contract.vendor) {
      throw new Error(
        `Couldn't find a valid vendor for contract ${contract.address}`
      )
    }

    const vendor: Vendor<VendorName> = yield call(
      VendorFactory.build,
      contract.vendor
    )

    const [nft, order]: AwaitFn<typeof vendor.nftService.fetchOne> = yield call(
      [vendor.nftService, 'fetchOne'],
      contractAddress,
      tokenId
    )

    yield put(fetchNFTSuccess(nft as NFT, order))
  } catch (error) {
    yield put(fetchNFTFailure(contractAddress, tokenId, error.message))
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
    yield put(transferNFTFailure(nft, address, error.message, error.code))
  }
}
