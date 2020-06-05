import { put, call, takeEvery, select } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import {
  CREATE_ORDER_REQUEST,
  CreateOrderRequestAction,
  createOrderFailure,
  createOrderSuccess,
  EXECUTE_ORDER_REQUEST,
  executeOrderSuccess,
  executeOrderFailure,
  ExecuteOrderRequestAction,
  CANCEL_ORDER_REQUEST,
  CancelOrderRequestAction,
  cancelOrderSuccess,
  cancelOrderFailure
} from './actions'
import { getAddress } from '../wallet/selectors'
import { locations } from '../routing/locations'
import { VendorFactory, Vendors } from '../vendor'

export function* orderSaga() {
  yield takeEvery(CREATE_ORDER_REQUEST, handleCreateOrderRequest)
  yield takeEvery(EXECUTE_ORDER_REQUEST, handleExecuteOrderRequest)
  yield takeEvery(CANCEL_ORDER_REQUEST, handleCancelOrderRequest)
}

function* handleCreateOrderRequest(action: CreateOrderRequestAction) {
  const { nft, price, expiresAt } = action.payload
  try {
    const { orderService } = VendorFactory.build(Vendors.DECENTRALAND)

    const address = yield select(getAddress)
    const txHash = yield call(() =>
      orderService!.create(nft, price, expiresAt, address)
    )
    yield put(createOrderSuccess(nft, price, expiresAt, txHash))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(createOrderFailure(nft, price, expiresAt, error.message))
  }
}

function* handleExecuteOrderRequest(action: ExecuteOrderRequestAction) {
  const { order, nft, fingerprint } = action.payload
  try {
    if (order.nftId !== nft.id) {
      throw new Error('The order does not match the NFT')
    }
    const { orderService } = VendorFactory.build(Vendors.DECENTRALAND)

    const address = yield select(getAddress)
    const price = Number(order.price)
    const txHash = yield call(() =>
      orderService!.execute(nft, price, address, fingerprint)
    )

    yield put(executeOrderSuccess(order, nft, txHash))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(executeOrderFailure(order, nft, error.message))
  }
}

function* handleCancelOrderRequest(action: CancelOrderRequestAction) {
  const { order, nft } = action.payload
  try {
    if (order.nftId !== nft.id) {
      throw new Error('The order does not match the NFT')
    }
    const { orderService } = VendorFactory.build(Vendors.DECENTRALAND)

    const address = yield select(getAddress)
    const txHash = yield call(() => orderService!.cancel(nft, address))
    yield put(cancelOrderSuccess(order, nft, txHash))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(cancelOrderFailure(order, nft, error.message))
  }
}
