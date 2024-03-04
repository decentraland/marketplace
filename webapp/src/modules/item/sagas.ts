import { matchPath } from 'react-router-dom'
import { getLocation, push } from 'connected-react-router'
import { SagaIterator } from 'redux-saga'
import { put, takeEvery } from '@redux-saga/core/effects'
import {
  call,
  cancel,
  cancelled,
  delay,
  fork,
  race,
  select,
  take
} from 'redux-saga/effects'
import { ethers } from 'ethers'
import { ChainId, Item } from '@dcl/schemas'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import { ContractName, getContract } from 'decentraland-transactions'
import { Provider } from 'decentraland-connect'
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
import { StatusResponse } from 'decentraland-transactions/crossChain'
import { showToast } from 'decentraland-dapps/dist/modules/toast/actions'
import { getCrossChainTransactionSuccessToast } from '../toast/toasts'
import { config } from '../../config'
import { ItemAPI } from '../vendor/decentraland/item/api'
import { getWallet } from '../wallet/selectors'
import { buyAssetWithCard } from '../asset/utils'
import { isCatalogView } from '../routing/utils'
import { waitForWalletConnectionAndIdentityIfConnecting } from '../wallet/utils'
import { retryParams } from '../vendor/decentraland/utils'
import { CatalogAPI } from '../vendor/decentraland/catalog/api'
import { locations } from '../routing/locations'
import { fetchSmartWearableRequiredPermissionsRequest } from '../asset/actions'
import { MARKETPLACE_SERVER_URL } from '../vendor/decentraland'
import { getIsMarketplaceServerEnabled } from '../features/selectors'
import { waitForFeatureFlagsToBeLoaded } from '../features/utils'
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
  FETCH_COLLECTION_ITEMS_REQUEST,
  FETCH_ITEMS_CANCELLED_ERROR_MESSAGE,
  BuyItemCrossChainRequestAction,
  BUY_ITEM_CROSS_CHAIN_REQUEST,
  buyItemCrossChainSuccess,
  buyItemCrossChainFailure,
  BUY_ITEM_CROSS_CHAIN_SUCCESS,
  BuyItemCrossChainSuccessAction,
  trackCrossChainTx
} from './actions'
import { getData as getItems } from './selectors'
import { AssetType } from '../asset/types'
import { getItem } from './utils'

export const NFT_SERVER_URL = config.get('NFT_SERVER_URL')!
export const CANCEL_FETCH_ITEMS = 'CANCEL_FETCH_ITEMS'

export function* itemSaga(getIdentity: () => AuthIdentity | undefined) {
  const API_OPTS = {
    retries: retryParams.attempts,
    retryDelay: retryParams.delay,
    identity: getIdentity
  }
  const itemAPI = new ItemAPI(NFT_SERVER_URL, API_OPTS)
  const marketplaceServerCatalogAPI = new CatalogAPI(
    MARKETPLACE_SERVER_URL,
    API_OPTS
  )
  const catalogAPI = new CatalogAPI(NFT_SERVER_URL, API_OPTS)

  yield fork(() => takeLatestByPath(FETCH_ITEMS_REQUEST, locations.browse()))
  yield takeEvery(
    FETCH_COLLECTION_ITEMS_REQUEST,
    handleFetchCollectionItemsRequest
  )
  yield takeEvery(FETCH_TRENDING_ITEMS_REQUEST, handleFetchTrendingItemsRequest)
  yield takeEvery(BUY_ITEM_REQUEST, handleBuyItem)
  yield takeEvery(BUY_ITEM_CROSS_CHAIN_REQUEST, handleBuyItemCrossChain)
  yield takeEvery(BUY_ITEM_CROSS_CHAIN_SUCCESS, handleBuyItemCrossChainSuccess)
  yield takeEvery(BUY_ITEM_WITH_CARD_REQUEST, handleBuyItemWithCardRequest)
  yield takeEvery(SET_PURCHASE, handleSetItemPurchaseWithCard)
  yield takeEvery(FETCH_ITEM_REQUEST, handleFetchItemRequest)

  // to avoid race conditions, just one fetch items request is handled at once in the browse page
  function* takeLatestByPath(actionType: string, path: string): SagaIterator {
    let task

    while (true) {
      const action: FetchItemsRequestAction = yield take(actionType)
      const {
        pathname: currentPathname
      }: ReturnType<typeof getLocation> = yield select(getLocation)

      // if we have a task running in the browse path, we cancel the previous one
      if (matchPath(currentPathname, { path }) && task && task.isRunning()) {
        yield put({ type: CANCEL_FETCH_ITEMS }) // to unblock the saga waiting for the identity success
        yield cancel(task)
      }
      task = yield fork(handleFetchItemsRequest, action)
    }
  }

  function* handleFetchTrendingItemsRequest(
    action: FetchTrendingItemsRequestAction
  ) {
    const { size } = action.payload

    // If the wallet is getting connected, wait until it finishes to fetch the items so it can fetch them with authentication

    try {
      yield call(waitForWalletConnectionAndIdentityIfConnecting)
      const { data }: { data: Item[] } = yield call(
        [itemAPI, 'getTrendings'],
        size
      )

      if (!data.length) {
        yield put(fetchTrendingItemsSuccess([]))
        return
      }

      const ids = data.map(item => item.id)
      const isMarketplaceServerEnabled: boolean = yield select(
        getIsMarketplaceServerEnabled
      )
      const api = isMarketplaceServerEnabled
        ? marketplaceServerCatalogAPI
        : catalogAPI
      const { data: itemData }: { data: Item[]; total: number } = yield call(
        [api, 'get'],
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

  function* handleFetchItemsRequest(
    action: FetchItemsRequestAction
  ): SagaIterator {
    const { filters, view } = action.payload

    try {
      // If the wallet is getting connected, wait until it finishes to fetch the wallet and generate the identity so it can fetch them with authentication
      yield call(waitForWalletConnectionAndIdentityIfConnecting)
      yield call(waitForFeatureFlagsToBeLoaded)
      const isMarketplaceServerEnabled: boolean = yield select(
        getIsMarketplaceServerEnabled
      )
      const catalogViewAPI = isMarketplaceServerEnabled
        ? marketplaceServerCatalogAPI
        : catalogAPI
      const api = isCatalogView(view) ? catalogViewAPI : itemAPI
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
    } finally {
      if (yield cancelled()) {
        // if cancelled, we dispatch a failure action so it cleans the loading state
        yield put(
          fetchItemsFailure(FETCH_ITEMS_CANCELLED_ERROR_MESSAGE, action.payload)
        )
      }
    }
  }

  function* handleFetchItemRequest(action: FetchItemRequestAction) {
    const { contractAddress, tokenId } = action.payload

    // If the wallet is getting connected, wait until it finishes to fetch the items so it can fetch them with authentication

    try {
      yield call(waitForWalletConnectionAndIdentityIfConnecting)
      const item: Item = yield call(
        [itemAPI, 'getOne'],
        contractAddress,
        tokenId
      )
      yield put(fetchItemSuccess(item))
      if (item.data?.wearable?.isSmart && item.urn) {
        yield put(fetchSmartWearableRequiredPermissionsRequest(item))
      }
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

      yield put(buyItemSuccess(wallet.chainId, txHash, item))
    } catch (error) {
      yield put(
        buyItemFailure(
          isErrorWithMessage(error) ? error.message : t('global.unknown_error')
        )
      )
    }
  }

  function* handleBuyItemCrossChainSuccess(
    action: BuyItemCrossChainSuccessAction
  ) {
    const { route, item, order, txHash } = action.payload
    // if it's an actual cross-chain interaction, we need to get the tx hash in the destination chain
    if (
      route.requestId &&
      route.route.params.fromChain !== route.route.params.toChain
    ) {
      let status: StatusResponse | undefined
      const crossChainModule = import('decentraland-transactions/crossChain')
      const {
        AxelarProvider
      }: Awaited<typeof crossChainModule> = yield crossChainModule
      const crossChainProvider = new AxelarProvider(config.get('SQUID_API_URL'))
      const destinationChain = Number(route.route.params.toChain) as ChainId
      while (!status || !status?.toChain?.transactionId) {
        // wrapping in try-catch since it throws an error if the tx is not found (the first seconds after triggering it)
        try {
          status = yield call(
            [crossChainProvider, 'getStatus'],
            route.requestId,
            txHash
          )
        } catch (error) {
          console.error('error: ', error)
        }
        yield delay(1000)
      }
      if (status?.toChain?.transactionId) {
        yield put(
          trackCrossChainTx(destinationChain, status?.toChain?.transactionId)
        )
        yield put(
          push(
            locations.success({
              txHash,
              destinationTxHash: status?.toChain?.transactionId,
              tokenId: item.itemId,
              assetType: order ? AssetType.NFT : AssetType.ITEM,
              contractAddress: order
                ? order.contractAddress
                : item.contractAddress,
              isCrossChain: ('route' in action.payload).toString()
            })
          )
        )
        yield put(
          showToast(
            getCrossChainTransactionSuccessToast(
              AxelarProvider.getTxLink(txHash)
            )
          )
        )
      }
    }
  }

  function* handleBuyItemCrossChain(action: BuyItemCrossChainRequestAction) {
    const { item, route, order } = action.payload
    try {
      const wallet: ReturnType<typeof getWallet> = yield select(getWallet)

      const provider: Provider | null = yield call(getConnectedProvider)

      if (!wallet) {
        throw new Error('A defined wallet is required to buy an item')
      }

      if (provider) {
        const crossChainModule = import('decentraland-transactions/crossChain')
        const {
          AxelarProvider
        }: Awaited<typeof crossChainModule> = yield crossChainModule
        const crossChainProvider = new AxelarProvider(
          config.get('SQUID_API_URL')
        )
        const txResponse: ethers.providers.TransactionReceipt = yield call(
          [crossChainProvider, 'executeRoute'],
          route,
          provider
        )

        yield put(
          buyItemCrossChainSuccess(
            route,
            Number(route.route.params.fromChain),
            txResponse.transactionHash,
            item,
            order
          )
        )
      }
    } catch (error) {
      yield put(
        buyItemCrossChainFailure(
          route,
          item,
          order?.price || item.price,
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
