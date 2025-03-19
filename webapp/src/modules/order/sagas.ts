import { History } from 'history'
import { put, call, takeEvery, select, race, take, getContext } from 'redux-saga/effects'
import { ListingStatus, RentalStatus, Trade, TradeCreation } from '@dcl/schemas'
import { SetPurchaseAction, SET_PURCHASE } from 'decentraland-dapps/dist/modules/gateway/actions'
import { PurchaseStatus } from 'decentraland-dapps/dist/modules/gateway/types'
import { isNFTPurchase } from 'decentraland-dapps/dist/modules/gateway/utils'
import { TradeService } from 'decentraland-dapps/dist/modules/trades/TradeService'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { CONNECT_WALLET_SUCCESS, ConnectWalletSuccessAction } from 'decentraland-dapps/dist/modules/wallet/actions'
import { ErrorCode } from 'decentraland-transactions'
import creditsService from '../../lib/credits'
import { isErrorWithMessage } from '../../lib/error'
import { buyAssetWithCard } from '../asset/utils'
import { pollCreditsBalanceRequest } from '../credits/actions'
import { getCredits } from '../credits/selectors'
import { getIsCreditsEnabled, getIsOffchainPublicNFTOrdersEnabled } from '../features/selectors'
import { waitForFeatureFlagsToBeLoaded } from '../features/utils'
import { FetchNFTFailureAction, fetchNFTRequest, FetchNFTSuccessAction, FETCH_NFT_FAILURE, FETCH_NFT_SUCCESS } from '../nft/actions'
import { getData as getNFTs } from '../nft/selectors'
import { getNFT } from '../nft/utils'
import { getRentalById } from '../rental/selectors'
import { isRentalListingOpen, waitUntilRentalChangesStatus } from '../rental/utils'
import { locations } from '../routing/locations'
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
  fetchOrdersFailure,
  cancelOrderSuccessTx
} from './actions'
import { LegacyOrderFragment } from './types'
import * as orderUtils from './utils'

export function* orderSaga(tradeService: TradeService) {
  yield takeEvery(CREATE_ORDER_REQUEST, handleCreateOrderRequest)
  yield takeEvery(EXECUTE_ORDER_REQUEST, handleExecuteOrderRequest)
  yield takeEvery(EXECUTE_ORDER_WITH_CARD_REQUEST, handleExecuteOrderWithCardRequest)
  yield takeEvery(SET_PURCHASE, handleSetNftPurchaseWithCard)
  yield takeEvery(CANCEL_ORDER_REQUEST, handleCancelOrderRequest)
  yield takeEvery(FETCH_LEGACY_ORDERS_REQUEST, handleFetchLegacyOrdersRequest)
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)

  function* handleConnectWalletSuccess(action: ConnectWalletSuccessAction) {
    const { address } = action.payload.wallet
    yield put(fetchOrdersRequest(address, { status: ListingStatus.OPEN }))
  }

  function* handleFetchLegacyOrdersRequest(action: FetchLegacyOrdersRequestAction) {
    const { address, filters } = action.payload

    try {
      const query = orderUtils.getSubgraphOrdersQuery({ ...filters, owner: address })

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
    const { nft, price, expiresAt, fingerprint } = action.payload
    try {
      const isOffchainPublicNFTOrdersEnabled: boolean = yield select(getIsOffchainPublicNFTOrdersEnabled)
      if (isOffchainPublicNFTOrdersEnabled) {
        const history: History = yield getContext('history')
        const trade: TradeCreation = yield call([orderUtils, 'createPublicNFTOrderTrade'], nft, price, expiresAt, fingerprint)
        yield call([tradeService, 'addTrade'], trade)
        yield put(createOrderSuccess(nft, price, expiresAt))
        yield put(fetchNFTRequest(nft.contractAddress, nft.tokenId)) // fetch the NFT again to get the new order with the tradeId
        history.push(locations.nft(nft.contractAddress, nft.tokenId))
      } else {
        const { orderService } = VendorFactory.build(nft.vendor, undefined, !isOffchainPublicNFTOrdersEnabled)

        const wallet = (yield select(getWallet)) as ReturnType<typeof getWallet>
        const txHash = (yield call([orderService, 'create'], wallet, nft, price, expiresAt)) as Awaited<
          ReturnType<typeof orderService.create>
        >
        yield put(createOrderSuccess(nft, price, expiresAt, txHash))
      }
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
    const { order, nft, fingerprint, silent, useCredits } = action.payload

    try {
      if (nft.contractAddress !== order.contractAddress || nft.tokenId !== order.tokenId) {
        throw new Error('The order does not match the NFT')
      }
      yield call(waitForFeatureFlagsToBeLoaded)
      const isOffchainPublicNFTOrdersEnabled: boolean = yield select(getIsOffchainPublicNFTOrdersEnabled)
      const wallet = (yield select(getWallet)) as ReturnType<typeof getWallet>

      if (!wallet) {
        throw new Error('A defined wallet is required to buy an item')
      }

      const credits: ReturnType<typeof getCredits> = yield select(getCredits, wallet?.address || '')
      const isCreditsEnabled: boolean = yield select(getIsCreditsEnabled)
      let txHash: string
      if (order.tradeId) {
        if (!isOffchainPublicNFTOrdersEnabled) {
          throw new Error('not able to accept offchain orders')
        }

        if (!wallet) {
          throw new Error('Can not accept an order without a wallet')
        }

        const trade: Trade = yield call([tradeService, 'fetchTrade'], order.tradeId)
        if (isCreditsEnabled && useCredits && credits && credits.totalCredits > 0) {
          txHash = yield call([creditsService, 'useCreditsMarketplace'], trade, wallet, credits.credits)
        } else {
          txHash = yield call([tradeService, 'accept'], trade, wallet.address)
        }
        const expectedBalance = BigInt(credits.totalCredits) - BigInt(order.price)
        yield put(pollCreditsBalanceRequest(wallet.address, expectedBalance))
      } else {
        const { orderService } = (yield call(
          [VendorFactory, 'build'],
          nft.vendor,
          undefined,
          !isOffchainPublicNFTOrdersEnabled
        )) as ReturnType<typeof VendorFactory.build>

        if (isCreditsEnabled && useCredits && credits && credits.totalCredits > 0) {
          txHash = yield call([creditsService, 'useCreditsLegacyMarketplace'], nft, order, credits.credits)
        } else {
          txHash = (yield call([orderService, 'execute'], wallet, nft, order, fingerprint)) as Awaited<
            ReturnType<typeof orderService.execute>
          >
        }
        const expectedBalance = BigInt(credits.totalCredits) - BigInt(order.price)
        yield put(pollCreditsBalanceRequest(wallet.address, expectedBalance))
      }

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
    const { nft, order } = action.payload

    try {
      yield call(buyAssetWithCard, nft, order)
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
    const { order, nft, skipRedirection } = action.payload
    try {
      if (nft.contractAddress !== order.contractAddress && nft.tokenId !== order.tokenId) {
        throw new Error('The order does not match the NFT')
      }
      yield call(waitForFeatureFlagsToBeLoaded)
      const isOffchainPublicNFTOrdersEnabled: boolean = yield select(getIsOffchainPublicNFTOrdersEnabled)
      const wallet = (yield select(getWallet)) as ReturnType<typeof getWallet>
      let txHash = ''

      if (order.tradeId) {
        if (!isOffchainPublicNFTOrdersEnabled) {
          throw new Error('Offchain orders are not supported yet')
        }

        if (!wallet) {
          throw new Error('Can not cancel an order without a wallet')
        }

        const trade: Trade = yield call([tradeService, 'fetchTrade'], order.tradeId)
        txHash = yield call([tradeService, 'cancel'], trade, wallet.address)
        yield put(cancelOrderSuccessTx(order, nft, txHash))
        yield waitForTx(txHash)
        yield put(cancelOrderSuccess(order, nft, txHash, skipRedirection))
      } else {
        const { orderService } = VendorFactory.build(nft.vendor, undefined, !isOffchainPublicNFTOrdersEnabled)
        txHash = (yield call([orderService, 'cancel'], wallet, order)) as Awaited<ReturnType<typeof orderService.cancel>>
        yield put(cancelOrderSuccess(order, nft, txHash, skipRedirection))
      }
    } catch (error) {
      const errorMessage = isErrorWithMessage(error) ? error.message : t('global.unknown_error')
      const errorCode =
        error !== undefined && error !== null && typeof error === 'object' && 'code' in error
          ? (error as { code: ErrorCode }).code
          : undefined

      yield put(cancelOrderFailure(order, nft, errorMessage, errorCode))
    }
  }
}
