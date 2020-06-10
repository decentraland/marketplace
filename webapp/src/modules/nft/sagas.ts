import { takeEvery, call, put, select } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import {
  DEFAULT_FETCH_NFTS_OPTIONS,
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
import { getAddress } from '../wallet/selectors'
import { locations } from '../routing/locations'
import { VendorFactory, Vendors } from '../vendor'
import { AwaitFn } from '../types'

export function* nftSaga() {
  yield takeEvery(FETCH_NFTS_REQUEST, handleFetchNFTsRequest)
  yield takeEvery(FETCH_NFT_REQUEST, handleFetchNFTRequest)
  yield takeEvery(TRANSFER_NFT_REQUEST, handleTransferNFTRequest)
}

function* handleFetchNFTsRequest(action: FetchNFTsRequestAction) {
  const { timestamp } = action.payload
  const options = {
    ...DEFAULT_FETCH_NFTS_OPTIONS,
    ...action.payload.options,
    variables: {
      ...DEFAULT_FETCH_NFTS_OPTIONS.variables,
      ...action.payload.options.variables
    }
  }

  try {
    const { nftService } = VendorFactory.build(Vendors.DECENTRALAND)

    const [
      nfts,
      accounts,
      orders,
      count
    ]: AwaitFn<typeof nftService.fetch> = yield call(() =>
      nftService.fetch(options)
    )

    yield put(
      fetchNFTsSuccess(options, nfts, accounts, orders, count, timestamp)
    )
  } catch (error) {
    yield put(fetchNFTsFailure(options, error.message, timestamp))
  }
}

function* handleFetchNFTRequest(action: FetchNFTRequestAction) {
  const { contractAddress, tokenId } = action.payload

  try {
    const { nftService } = VendorFactory.build(Vendors.DECENTRALAND)

    const [nft, order]: AwaitFn<typeof nftService.fetchOne> = yield call(() =>
      nftService.fetchOne(contractAddress, tokenId)
    )

    yield put(fetchNFTSuccess(nft, order))
  } catch (error) {
    yield put(fetchNFTFailure(contractAddress, tokenId, error.message))
  }
}

function* handleTransferNFTRequest(action: TransferNFTRequestAction) {
  const { nft, address } = action.payload
  try {
    const { nftService } = VendorFactory.build(Vendors.DECENTRALAND)

    const from = yield select(getAddress)
    const txHash = yield call(() => nftService.transfer(from, address, nft))

    yield put(transferNFTSuccess(nft, address, txHash))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(transferNFTFailure(nft, address, error.message))
  }
}
