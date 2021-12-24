import { put, call, takeEvery, select } from 'redux-saga/effects'
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
import { getWallet } from '../wallet/selectors'
import { VendorFactory } from '../vendor/VendorFactory'

export function* orderSaga() {
  yield takeEvery(CREATE_ORDER_REQUEST, handleCreateOrderRequest)
  yield takeEvery(EXECUTE_ORDER_REQUEST, handleExecuteOrderRequest)
  yield takeEvery(CANCEL_ORDER_REQUEST, handleCancelOrderRequest)
}

function* handleCreateOrderRequest(action: CreateOrderRequestAction) {
  const { nft, price, expiresAt } = action.payload
  try {
    const { orderService } = VendorFactory.build(nft.vendor)

    const wallet: ReturnType<typeof getWallet> = yield select(getWallet)
    const txHash: string = yield call(() =>
      orderService.create(wallet, nft, price, expiresAt)
    )
    yield put(createOrderSuccess(nft, price, expiresAt, txHash))
  } catch (error) {
    yield put(
      createOrderFailure(nft, price, expiresAt, error.message, error.code)
    )
  }
}

function* handleExecuteOrderRequest(action: ExecuteOrderRequestAction) {
  const { order, nft, fingerprint } = action.payload
  try {
    if (
      nft.contractAddress !== order.contractAddress &&
      nft.tokenId !== order.tokenId
    ) {
      throw new Error('The order does not match the NFT')
    }
    const { orderService } = VendorFactory.build(nft.vendor)

    const wallet: ReturnType<typeof getWallet> = yield select(getWallet)
    const txHash: string = yield call(() =>
      orderService.execute(wallet, nft, order, fingerprint)
    )

    yield put(executeOrderSuccess(order, nft, txHash))
  } catch (error) {
    yield put(executeOrderFailure(order, nft, error.message, error.code))
  }
}

function* handleCancelOrderRequest(action: CancelOrderRequestAction) {
  const { order, nft } = action.payload
  try {
    if (
      nft.contractAddress !== order.contractAddress &&
      nft.tokenId !== order.tokenId
    ) {
      throw new Error('The order does not match the NFT')
    }
    const { orderService } = VendorFactory.build(nft.vendor)

    const wallet: ReturnType<typeof getWallet> = yield select(getWallet)
    const txHash: string = yield call(() => orderService.cancel(wallet, order))
    yield put(cancelOrderSuccess(order, nft, txHash))
  } catch (error) {
    yield put(cancelOrderFailure(order, nft, error.message, error.code))
  }
}
