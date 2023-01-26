import { put, call, takeEvery, select } from 'redux-saga/effects'
import { RentalListing, RentalStatus } from '@dcl/schemas'
import { ErrorCode } from 'decentraland-transactions'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import {
  SetPurchaseAction,
  SET_PURCHASE
} from 'decentraland-dapps/dist/modules/gateway/actions'
import { isManaPurchase } from 'decentraland-dapps/dist/modules/gateway/utils'
import { PurchaseStatus } from 'decentraland-dapps/dist/modules/gateway/types'
import { isErrorWithMessage } from '../../lib/error'
import { getWallet } from '../wallet/selectors'
import { Vendor, VendorFactory } from '../vendor/VendorFactory'
import { getRentalById } from '../rental/selectors'
import {
  isRentalListingOpen,
  waitUntilRentalChangesStatus
} from '../rental/utils'
import { buyAssetWithCard } from '../asset/utils'
import { VendorName } from '../vendor'
import { getData as getNFTs } from '../nft/selectors'
import { getNFT } from '../nft/utils'
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
  cancelOrderFailure,
  executeOrderTransactionSubmitted,
  ExecuteOrderWithCardRequestAction,
  EXECUTE_ORDER_WITH_CARD_REQUEST,
  executeOrderWithCardFailure,
  executeOrderWithCardSuccess
} from './actions'

export function* orderSaga() {
  yield takeEvery(CREATE_ORDER_REQUEST, handleCreateOrderRequest)
  yield takeEvery(EXECUTE_ORDER_REQUEST, handleExecuteOrderRequest)
  yield takeEvery(
    EXECUTE_ORDER_WITH_CARD_REQUEST,
    handleExecuteOrderWithCardRequest
  )
  yield takeEvery(SET_PURCHASE, handleSetNftPurchaseWithCard)
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

    yield put(
      createOrderFailure(nft, price, expiresAt, errorMessage, errorCode)
    )
  }
}

function* handleExecuteOrderRequest(action: ExecuteOrderRequestAction) {
  const { order, nft, fingerprint } = action.payload

  try {
    if (
      nft.contractAddress !== order.contractAddress ||
      nft.tokenId !== order.tokenId
    ) {
      throw new Error('The order does not match the NFT')
    }
    const { orderService }: Vendor<VendorName> = yield call(
      [VendorFactory, 'build'],
      nft.vendor
    )

    const wallet: ReturnType<typeof getWallet> = yield select(getWallet)
    const txHash: string = yield call(
      [orderService, 'execute'],
      wallet,
      nft,
      order,
      fingerprint
    )

    yield put(executeOrderTransactionSubmitted(order, nft, txHash))
    if (nft.openRentalId) {
      yield call(waitForTx, txHash)
      const rental: RentalListing = yield select(
        getRentalById,
        nft.openRentalId
      )
      if (isRentalListingOpen(rental)) {
        yield call(waitUntilRentalChangesStatus, nft, RentalStatus.CANCELLED)
      }
    }

    yield put(executeOrderSuccess())
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

    yield put(executeOrderFailure(order, nft, errorMessage, errorCode))
  }
}

function* handleExecuteOrderWithCardRequest(
  action: ExecuteOrderWithCardRequestAction
) {
  const { nft } = action.payload

  try {
    yield call(buyAssetWithCard, nft)
  } catch (error) {
    yield put(
      executeOrderWithCardFailure(
        nft,
        isErrorWithMessage(error) ? error.message : t('global.unknown_error')
      )
    )
  }
}

function* handleSetNftPurchaseWithCard(action: SetPurchaseAction) {
  const { purchase } = action.payload

  if (!isManaPurchase(purchase) && purchase.nft.tokenId) {
    const {
      status,
      txHash,
      nft: { contractAddress, tokenId }
    } = purchase

    const nfts: ReturnType<typeof getNFTs> = yield select(getNFTs)
    const nft: ReturnType<typeof getNFT> = yield call(
      getNFT,
      contractAddress,
      tokenId,
      nfts
    )

    if (nft && status === PurchaseStatus.COMPLETE && txHash) {
      yield put(executeOrderWithCardSuccess(purchase, nft, txHash))
    }
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

    yield put(cancelOrderFailure(order, nft, errorMessage, errorCode))
  }
}
