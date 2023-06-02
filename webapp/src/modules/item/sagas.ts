import { Item } from '@dcl/schemas'
import { put, takeEvery } from '@redux-saga/core/effects'
import { call, race, select, take } from 'redux-saga/effects'
import { ContractName, getContract } from 'decentraland-transactions'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  SetPurchaseAction,
  SET_PURCHASE
} from 'decentraland-dapps/dist/modules/gateway/actions'
import { isNFTPurchase } from 'decentraland-dapps/dist/modules/gateway/utils'
import { PurchaseStatus } from 'decentraland-dapps/dist/modules/gateway/types'
import { isErrorWithMessage } from '../../lib/error'
import { config } from '../../config'
import { ItemAPI } from '../vendor/decentraland/item/api'
import { getWallet } from '../wallet/selectors'
import { buyAssetWithCard } from '../asset/utils'
import { isCatalogView } from '../routing/utils'
import { waitForWalletConnectionIfConnecting } from '../wallet/utils'
import { retryParams } from '../vendor/decentraland/utils'
import { CatalogAPI } from '../vendor/decentraland/catalog/api'
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
  fetchItemRequest,
  FetchCollectionItemsRequestAction,
  fetchCollectionItemsSuccess,
  fetchCollectionItemsFailure,
  FETCH_COLLECTION_ITEMS_REQUEST
} from './actions'
import { getData as getItems } from './selectors'
import { getItem } from './utils'

export const NFT_SERVER_URL = config.get('NFT_SERVER_URL')!

export function* itemSaga(getIdentity: () => AuthIdentity | undefined) {
  const API_OPTS = {
    retries: retryParams.attempts,
    retryDelay: retryParams.delay,
    identity: getIdentity
  }
  const itemAPI = new ItemAPI(NFT_SERVER_URL, API_OPTS)
  const catalogAPI = new CatalogAPI(NFT_SERVER_URL, API_OPTS)

  yield takeEvery(FETCH_ITEMS_REQUEST, handleFetchItemsRequest)
  yield takeEvery(
    FETCH_COLLECTION_ITEMS_REQUEST,
    handleFetchCollectionItemsRequest
  )
  yield takeEvery(FETCH_TRENDING_ITEMS_REQUEST, handleFetchTrendingItemsRequest)
  yield takeEvery(BUY_ITEM_REQUEST, handleBuyItem)
  yield takeEvery(BUY_ITEM_WITH_CARD_REQUEST, handleBuyItemWithCardRequest)
  yield takeEvery(SET_PURCHASE, handleSetItemPurchaseWithCard)
  yield takeEvery(FETCH_ITEM_REQUEST, handleFetchItemRequest)

  function* handleFetchTrendingItemsRequest(
    action: FetchTrendingItemsRequestAction
  ) {
    const { size } = action.payload

    // If the wallet is getting connected, wait until it finishes to fetch the items so it can fetch them with authentication
    yield call(waitForWalletConnectionIfConnecting)

    try {
      const { data }: { data: Item[] } = yield call(
        [itemAPI, 'getTrendings'],
        size
      )
      const ids = data.map(item => item.id)
      const { data: itemData }: { data: Item[]; total: number } = yield call(
        [catalogAPI, 'get'],
        {
          ids
        }
      )
      yield put(fetchTrendingItemsSuccess(itemData))
    } catch (error) {
      yield put(
        fetchTrendingItemsFailure(
          isErrorWithMessage(error) ? error.message : t('global.unknown_error')
        )
      )
    }
  }

  function* handleFetchCollectionItemsRequest(
    action: FetchCollectionItemsRequestAction
  ) {
    const { contractAddresses, first } = action.payload
    try {
      const { data }: { data: Item[]; total: number } = yield call(
        [itemAPI, 'get'],
        { first, contractAddresses }
      )
      yield put(fetchCollectionItemsSuccess(data))
    } catch (error) {
      yield put(
        fetchCollectionItemsFailure(
          isErrorWithMessage(error) ? error.message : t('global.unknown_error')
        )
      )
    }
  }

  function* handleFetchItemsRequest(action: FetchItemsRequestAction) {
    const { filters, view } = action.payload

    // If the wallet is getting connected, wait until it finishes to fetch the items so it can fetch them with authentication
    yield call(waitForWalletConnectionIfConnecting)

    try {
      const api = isCatalogView(view) ? catalogAPI : itemAPI
      const { data, total }: { data: Item[]; total: number } = yield call(
        [api, 'get'],
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

  function* handleFetchItemRequest(action: FetchItemRequestAction) {
    const { contractAddress, tokenId } = action.payload

    // If the wallet is getting connected, wait until it finishes to fetch the items so it can fetch them with authentication
    yield call(waitForWalletConnectionIfConnecting)

    try {
      const item: Item = yield call(
        [itemAPI, 'getOne'],
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
            [
              item.contractAddress,
              [item.itemId],
              [item.price],
              [wallet.address]
            ]
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

  function* handleSetItemPurchaseWithCard(action: SetPurchaseAction) {
    try {
      const { purchase } = action.payload
      const { status, txHash } = purchase

      if (
        isNFTPurchase(purchase) &&
        purchase.nft.itemId &&
        status === PurchaseStatus.COMPLETE &&
        txHash
      ) {
        const {
          nft: { contractAddress, itemId }
        } = purchase

        const items: ReturnType<typeof getItems> = yield select(getItems)
        let item: ReturnType<typeof getItem> = yield call(
          getItem,
          contractAddress,
          itemId,
          items
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

          if (failure) throw new Error(failure.payload.error)

          item = success.payload.item
        }

        yield put(buyItemWithCardSuccess(item.chainId, txHash, item, purchase))
      }
    } catch (error) {
      yield put(
        buyItemWithCardFailure(
          isErrorWithMessage(error) ? error.message : t('global.unknown_error')
        )
      )
    }
  }
}
