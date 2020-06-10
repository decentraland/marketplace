import { push } from 'connected-react-router'
import { takeEvery, put, select, call } from 'redux-saga/effects'
import {
  PLACE_BID_REQUEST,
  PlaceBidRequestAction,
  placeBidFailure,
  placeBidSuccess,
  FETCH_BIDS_BY_ADDRESS_REQUEST,
  fetchBidsByAddressSuccess,
  fetchBidsByAddressFailure,
  FetchBidsByAddressRequestAction,
  ACCEPT_BID_REQUEST,
  CANCEL_BID_REQUEST,
  AcceptBidRequestAction,
  acceptBidSuccess,
  acceptBidFailure,
  CancelBidRequestAction,
  cancelBidSuccess,
  cancelBidFailure,
  FETCH_BIDS_BY_NFT_REQUEST,
  FetchBidsByNFTRequestAction,
  fetchBidsByNFTSuccess,
  fetchBidsByNFTFailure
} from './actions'
import { getAddress } from '../wallet/selectors'
import { locations } from '../routing/locations'
import { VendorFactory, Vendors } from '../vendor'
import { Bid } from './types'

export function* bidSaga() {
  yield takeEvery(PLACE_BID_REQUEST, handlePlaceBidRequest)
  yield takeEvery(ACCEPT_BID_REQUEST, handleAcceptBidRequest)
  yield takeEvery(CANCEL_BID_REQUEST, handleCancelBidRequest)
  yield takeEvery(
    FETCH_BIDS_BY_ADDRESS_REQUEST,
    handleFetchBidsByAddressRequest
  )
  yield takeEvery(FETCH_BIDS_BY_NFT_REQUEST, handleFetchBidsByNFTRequest)
}

function* handlePlaceBidRequest(action: PlaceBidRequestAction) {
  const { nft, price, expiresAt, fingerprint } = action.payload
  try {
    const { bidService } = VendorFactory.build(Vendors.DECENTRALAND)

    const address = yield select(getAddress)
    const txHash = yield call(() =>
      bidService!.place(nft, price, expiresAt, address, fingerprint)
    )

    yield put(
      placeBidSuccess(nft, price, expiresAt, txHash, address, fingerprint)
    )
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(placeBidFailure(nft, price, expiresAt, error, fingerprint))
  }
}

function* handleAcceptBidRequest(action: AcceptBidRequestAction) {
  const { bid } = action.payload
  try {
    const { bidService } = VendorFactory.build(Vendors.DECENTRALAND)

    const address = yield select(getAddress)
    const txHash = yield call(() => bidService!.accept(bid, address))

    yield put(acceptBidSuccess(bid, txHash))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(acceptBidFailure(bid, error.message))
  }
}

function* handleCancelBidRequest(action: CancelBidRequestAction) {
  const { bid } = action.payload
  try {
    const { bidService } = VendorFactory.build(Vendors.DECENTRALAND)

    const address = yield select(getAddress)
    const txHash = yield call(() => bidService!.cancel(bid, address))

    yield put(cancelBidSuccess(bid, txHash))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(cancelBidFailure(bid, error.message))
  }
}

function* handleFetchBidsByAddressRequest(
  action: FetchBidsByAddressRequestAction
) {
  const { address } = action.payload
  try {
    const { bidService } = VendorFactory.build(Vendors.DECENTRALAND)

    const [seller, bidder]: [Bid[], Bid[]] = yield call(() =>
      Promise.all([
        bidService!.fetchBySeller(address),
        bidService!.fetchByBidder(address)
      ])
    )

    yield put(fetchBidsByAddressSuccess(address, seller, bidder))
  } catch (error) {
    yield put(fetchBidsByAddressFailure(address, error.message))
  }
}

function* handleFetchBidsByNFTRequest(action: FetchBidsByNFTRequestAction) {
  const { nft } = action.payload
  try {
    const { bidService } = VendorFactory.build(Vendors.DECENTRALAND)

    const bids = yield call(() => bidService!.fetchByNFT(nft.id))

    yield put(fetchBidsByNFTSuccess(nft, bids))
  } catch (error) {
    yield put(fetchBidsByNFTFailure(nft, error.message))
  }
}
