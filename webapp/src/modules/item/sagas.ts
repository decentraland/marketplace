import { Item } from '@dcl/schemas'
import { put, takeEvery } from '@redux-saga/core/effects'
import { call, race, select, take } from 'redux-saga/effects'
import { ContractName, getContract } from 'decentraland-transactions'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  SetPurchaseAction,
  SET_PURCHASE
} from 'decentraland-dapps/dist/modules/gateway/actions'
import { isManaPurchase } from 'decentraland-dapps/dist/modules/gateway/utils'
import { PurchaseStatus } from 'decentraland-dapps/dist/modules/gateway/types'
import { isErrorWithMessage } from '../../lib/error'
import { itemAPI } from '../vendor/decentraland/item/api'
import { getWallet } from '../wallet/selectors'
import { buyAssetWithCard } from '../asset/utils'
import {
  buyItemFailure,
  BuyItemRequestAction,
  buyItemSuccess,
  BUY_ITEM_REQUEST,
  fetchItemsFailure,
  FetchItemsRequestAction,
  fetchItemsSuccess,
  FETCH_ITEMS_REQUEST,
  fetchItemFailure,
  FetchItemRequestAction,
  fetchItemSuccess,
  FETCH_ITEM_REQUEST,
  FETCH_TRENDING_ITEMS_REQUEST,
  FetchTrendingItemsRequestAction,
  fetchTrendingItemsSuccess,
  fetchTrendingItemsFailure,
  BuyItemWithCardRequestAction,
  BUY_ITEM_WITH_CARD_REQUEST,
  buyItemWithCardSuccess,
  buyItemWithCardFailure,
  FetchItemFailureAction,
  FetchItemSuccessAction,
  FETCH_ITEM_FAILURE,
  FETCH_ITEM_SUCCESS,
  fetchItemRequest
} from './actions'
import { getData as getItems } from './selectors'
import { getItem as getItemByContractAddressAndItemId } from './utils'

export function* itemSaga() {
  yield takeEvery(FETCH_ITEMS_REQUEST, handleFetchItemsRequest)
  yield takeEvery(FETCH_TRENDING_ITEMS_REQUEST, handleFetchTrendingItemsRequest)
  yield takeEvery(BUY_ITEM_REQUEST, handleBuyItem)
  yield takeEvery(BUY_ITEM_WITH_CARD_REQUEST, handleBuyItemWithCardRequest)
  yield takeEvery(SET_PURCHASE, handleSetItemPurchaseWithCard)
  yield takeEvery(FETCH_ITEM_REQUEST, handleFetchItemRequest)
}

function* handleFetchItemsRequest(action: FetchItemsRequestAction) {
  const { filters } = action.payload
  try {
    const { data, total }: { data: Item[]; total: number } = yield call(
      [itemAPI, 'fetch'],
      filters
    )

    yield put(fetchItemsSuccess(data, total, action.payload, Date.now()))
  } catch (error) {
    yield put(
      fetchItemsFailure(
        isErrorWithMessage(error) ? error.message : t('global.unknown_error'),
        action.payload
      )
    )
  }
}

function* handleFetchTrendingItemsRequest(
  action: FetchTrendingItemsRequestAction
) {
  const { size } = action.payload
  try {
    const { data }: { data: Item[] } = yield call(
      [itemAPI, 'fetchTrendings'],
      size
    )
    yield put(fetchTrendingItemsSuccess(data))
  } catch (error) {
    yield put(
      fetchTrendingItemsFailure(
        isErrorWithMessage(error) ? error.message : t('global.unknown_error')
      )
    )
  }
}

function* handleFetchItemRequest(action: FetchItemRequestAction) {
  const { contractAddress, tokenId } = action.payload
  try {
    const item: Item = yield call(
      [itemAPI, 'fetchOne'],
      contractAddress,
      tokenId
    )
    yield put(fetchItemSuccess(item))
  } catch (error) {
    yield put(
      fetchItemFailure(
        contractAddress,
        tokenId,
        isErrorWithMessage(error) ? error.message : t('global.unknown_error')
      )
    )
  }
}

function* handleBuyItem(action: BuyItemRequestAction) {
  try {
    const { item } = action.payload

    const wallet: ReturnType<typeof getWallet> = yield select(getWallet)

    if (!wallet) {
      throw new Error('A defined wallet is required to buy an item')
    }

    const contract = getContract(ContractName.CollectionStore, item.chainId)

    const txHash: string = yield call(
      sendTransaction,
      contract,
      collectionStore =>
        collectionStore.buy([
          [item.contractAddress, [item.itemId], [item.price], [wallet.address]]
        ])
    )

    yield put(buyItemSuccess(item.chainId, txHash, item))
  } catch (error) {
    yield put(
      buyItemFailure(
        isErrorWithMessage(error) ? error.message : t('global.unknown_error')
      )
    )
  }
}

function* handleBuyItemWithCardRequest(action: BuyItemWithCardRequestAction) {
  try {
    const { item } = action.payload
    yield call(buyAssetWithCard, item)
  } catch (error) {
    yield put(
      buyItemWithCardFailure(
        isErrorWithMessage(error) ? error.message : t('global.unknown_error')
      )
    )
  }
}

function* getItem(contractAddress: string, itemId: string) {
  const items: ReturnType<typeof getItems> = yield select(getItems)
  const item: ReturnType<typeof getItemByContractAddressAndItemId> = yield call(
    getItemByContractAddressAndItemId,
    contractAddress,
    itemId,
    items
  )
  return item
}

function* handleSetItemPurchaseWithCard(action: SetPurchaseAction) {
  try {
    const { purchase } = action.payload
    const { status, txHash } = purchase

    if (
      !isManaPurchase(purchase) &&
      purchase.nft.itemId &&
      status === PurchaseStatus.COMPLETE &&
      txHash
    ) {
      const {
        nft: { contractAddress, itemId }
      } = purchase

      let item: ReturnType<typeof getItemByContractAddressAndItemId> = yield call(
        getItem,
        contractAddress,
        itemId
      )

      if (!item) {
        yield put(fetchItemRequest(contractAddress, itemId))

        const {
          success,
          failure
        }: {
          success: FetchItemSuccessAction
          failure: FetchItemFailureAction
        } = yield race({
          success: take(FETCH_ITEM_SUCCESS),
          failure: take(FETCH_ITEM_FAILURE)
        })

        if (success) {
          item = yield call(getItem, contractAddress, itemId)
        } else {
          yield put(buyItemWithCardFailure(failure.payload.error))
        }
      }

      if (item) {
        yield put(buyItemWithCardSuccess(item.chainId, txHash, item, purchase))
      }
    }
  } catch (error) {
    yield put(
      buyItemWithCardFailure(
        isErrorWithMessage(error) ? error.message : t('global.unknown_error')
      )
    )
  }
}
