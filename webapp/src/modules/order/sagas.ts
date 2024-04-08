import { put, call, takeEvery, select, race, take } from 'redux-saga/effects'
import { ListingStatus, RentalStatus } from '@dcl/schemas'
import { SetPurchaseAction, SET_PURCHASE } from 'decentraland-dapps/dist/modules/gateway/actions'
import { PurchaseStatus } from 'decentraland-dapps/dist/modules/gateway/types'
import { isNFTPurchase } from 'decentraland-dapps/dist/modules/gateway/utils'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { CONNECT_WALLET_SUCCESS, ConnectWalletSuccessAction } from 'decentraland-dapps/dist/modules/wallet/actions'
import { ErrorCode } from 'decentraland-transactions'
import { isErrorWithMessage } from '../../lib/error'
import { buyAssetWithCard } from '../asset/utils'
import { FetchNFTFailureAction, fetchNFTRequest, FetchNFTSuccessAction, FETCH_NFT_FAILURE, FETCH_NFT_SUCCESS } from '../nft/actions'
import { getData as getNFTs } from '../nft/selectors'
import { getNFT } from '../nft/utils'
import { getRentalById } from '../rental/selectors'
import { isRentalListingOpen, waitUntilRentalChangesStatus } from '../rental/utils'
import SubgraphService from '../vendor/decentraland/SubgraphService'
import { VendorFactory } from '../vendor/VendorFactory'
import { getWallet } from '../wallet/selectors'
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
  executeOrderWithCardSuccess,
  FETCH_LEGACY_ORDERS_REQUEST,
  FetchLegacyOrdersRequestAction,
  fetchOrdersSuccess,
  fetchOrdersRequest,
  fetchOrdersFailure
} from './actions'
import { LegacyOrderFragment } from './types'
import { getSubgraphOrdersQuery } from './utils'

export function* orderSaga() {
  yield takeEvery(CREATE_ORDER_REQUEST, handleCreateOrderRequest)
  yield takeEvery(EXECUTE_ORDER_REQUEST, handleExecuteOrderRequest)
  yield takeEvery(EXECUTE_ORDER_WITH_CARD_REQUEST, handleExecuteOrderWithCardRequest)
  yield takeEvery(SET_PURCHASE, handleSetNftPurchaseWithCard)
  yield takeEvery(CANCEL_ORDER_REQUEST, handleCancelOrderRequest)
  yield takeEvery(FETCH_LEGACY_ORDERS_REQUEST, handleFetchLegacyOrdersRequest)
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
}

function* handleConnectWalletSuccess(action: ConnectWalletSuccessAction) {
  const { address } = action.payload.wallet
  yield put(fetchOrdersRequest(address, { status: ListingStatus.OPEN }))
}

function* handleFetchLegacyOrdersRequest(action: FetchLegacyOrdersRequestAction) {
  const { address, filters } = action.payload

  try {
    const query = getSubgraphOrdersQuery({ ...filters, owner: address })

    const response = (yield call(
      [SubgraphService, 'fetch'],
      'marketplace-legacy', // @TODO: put this nicer
      query
    )) as { data: { orders: LegacyOrderFragment[] } }
    yield put(fetchOrdersSuccess(response.data.orders))
  } catch (error) {
    const errorMessage = isErrorWithMessage(error) ? error.message : t('global.unknown_error')
    const errorCode =
      error !== undefined && error !== null && typeof error === 'object' && 'code' in error
        ? (error as { code: ErrorCode }).code
        : undefined

    yield put(fetchOrdersFailure(address, errorMessage, errorCode))
  }
}

function* handleCreateOrderRequest(action: CreateOrderRequestAction) {
  const { nft, price, expiresAt } = action.payload
  try {
    const { orderService } = VendorFactory.build(nft.vendor)

    const wallet = (yield select(getWallet)) as ReturnType<typeof getWallet>
    const txHash = (yield call([orderService, 'create'], wallet, nft, price, expiresAt)) as Awaited<ReturnType<typeof orderService.create>>
    yield put(createOrderSuccess(nft, price, expiresAt, txHash))
  } catch (error) {
    const errorMessage = isErrorWithMessage(error) ? error.message : t('global.unknown_error')
    const errorCode =
      error !== undefined && error !== null && typeof error === 'object' && 'code' in error
        ? (error as { code: ErrorCode }).code
        : undefined

    yield put(createOrderFailure(nft, price, expiresAt, errorMessage, errorCode))
  }
}

function* handleExecuteOrderRequest(action: ExecuteOrderRequestAction) {
  const { order, nft, fingerprint, silent } = action.payload

  try {
    if (nft.contractAddress !== order.contractAddress || nft.tokenId !== order.tokenId) {
      throw new Error('The order does not match the NFT')
    }
    const { orderService } = (yield call([VendorFactory, 'build'], nft.vendor)) as ReturnType<typeof VendorFactory.build>

    const wallet = (yield select(getWallet)) as ReturnType<typeof getWallet>
    const txHash = (yield call([orderService, 'execute'], wallet, nft, order, fingerprint)) as Awaited<
      ReturnType<typeof orderService.execute>
    >

    yield put(executeOrderTransactionSubmitted(order, nft, txHash))
    if (nft.openRentalId) {
      yield call(waitForTx, txHash)
      const rental = (yield select(getRentalById, nft.openRentalId)) as ReturnType<typeof getRentalById>
      if (isRentalListingOpen(rental)) {
        yield call(waitUntilRentalChangesStatus, nft, RentalStatus.CANCELLED)
      }
    }

    yield put(executeOrderSuccess(txHash, nft))
  } catch (error) {
    const errorMessage = isErrorWithMessage(error) ? error.message : t('global.unknown_error')
    const errorCode =
      error !== undefined && error !== null && typeof error === 'object' && 'code' in error
        ? (error as { code: ErrorCode }).code
        : undefined

    yield put(executeOrderFailure(order, nft, errorMessage, errorCode, silent))
  }
}

function* handleExecuteOrderWithCardRequest(action: ExecuteOrderWithCardRequestAction) {
  const { nft } = action.payload

  try {
    yield call(buyAssetWithCard, nft)
  } catch (error) {
    yield put(executeOrderWithCardFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}

function* handleSetNftPurchaseWithCard(action: SetPurchaseAction) {
  try {
    const { purchase } = action.payload
    const { status, txHash } = purchase

    if (isNFTPurchase(purchase) && purchase.nft.tokenId && status === PurchaseStatus.COMPLETE && txHash) {
      const {
        nft: { contractAddress, tokenId }
      } = purchase

      const nfts = (yield select(getNFTs)) as ReturnType<typeof getNFTs>
      let nft = (yield call(getNFT, contractAddress, tokenId, nfts)) as ReturnType<typeof getNFT>

      if (!nft) {
        yield put(fetchNFTRequest(contractAddress, tokenId))

        const { success, failure } = (yield race({
          success: take(FETCH_NFT_SUCCESS),
          failure: take(FETCH_NFT_FAILURE)
        })) as {
          success: FetchNFTSuccessAction
          failure: FetchNFTFailureAction
        }

        if (failure) throw new Error(failure.payload.error)

        nft = success.payload.nft
      }

      yield put(executeOrderWithCardSuccess(purchase, nft, txHash))
    }
  } catch (error) {
    yield put(executeOrderWithCardFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}

function* handleCancelOrderRequest(action: CancelOrderRequestAction) {
  const { order, nft } = action.payload
  try {
    if (nft.contractAddress !== order.contractAddress && nft.tokenId !== order.tokenId) {
      throw new Error('The order does not match the NFT')
    }
    const { orderService } = VendorFactory.build(nft.vendor)

    const wallet = (yield select(getWallet)) as ReturnType<typeof getWallet>
    const txHash = (yield call([orderService, 'cancel'], wallet, order)) as Awaited<ReturnType<typeof orderService.cancel>>
    yield put(cancelOrderSuccess(order, nft, txHash))
  } catch (error) {
    const errorMessage = isErrorWithMessage(error) ? error.message : t('global.unknown_error')
    const errorCode =
      error !== undefined && error !== null && typeof error === 'object' && 'code' in error
        ? (error as { code: ErrorCode }).code
        : undefined

    yield put(cancelOrderFailure(order, nft, errorMessage, errorCode))
  }
}
