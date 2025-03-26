import { matchPath } from 'react-router-dom'
import { put, takeEvery } from '@redux-saga/core/effects'
import { ethers } from 'ethers'
import { History } from 'history'
import { SagaIterator, Task } from 'redux-saga'
import { call, cancel, cancelled, fork, race, select, take, getContext } from 'redux-saga/effects'
import { CatalogFilters, Entity, Trade } from '@dcl/schemas'
import { CreditsService } from 'decentraland-dapps/dist/lib/credits'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import { pollCreditsBalanceRequest } from 'decentraland-dapps/dist/modules/credits/actions'
import { getCredits } from 'decentraland-dapps/dist/modules/credits/selectors'
import { CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'
import { SetPurchaseAction, SET_PURCHASE } from 'decentraland-dapps/dist/modules/gateway/actions'
import { PurchaseStatus } from 'decentraland-dapps/dist/modules/gateway/types'
import { isNFTPurchase } from 'decentraland-dapps/dist/modules/gateway/utils'
import { TradeService } from 'decentraland-dapps/dist/modules/trades/TradeService'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { Provider } from 'decentraland-connect'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { ContractName, getContract } from 'decentraland-transactions'
import { config } from '../../config'
import { API_SIGNER } from '../../lib/api'
import { isErrorWithMessage } from '../../lib/error'
import { fetchSmartWearableRequiredPermissionsRequest } from '../asset/actions'
import { buyAssetWithCard } from '../asset/utils'
import {
  getIsCreditsEnabled,
  getIsMarketplaceServerEnabled,
  getIsOffchainPublicItemOrdersEnabled,
  getIsOffchainPublicNFTOrdersEnabled
} from '../features/selectors'
import { waitForFeatureFlagsToBeLoaded } from '../features/utils'
import { locations } from '../routing/locations'
import { isCatalogView } from '../routing/utils'
import { MARKETPLACE_SERVER_URL } from '../vendor/decentraland'
import { CatalogAPI } from '../vendor/decentraland/catalog/api'
import { ItemAPI } from '../vendor/decentraland/item/api'
import { peerAPI } from '../vendor/decentraland/peer/api'
import { retryParams } from '../vendor/decentraland/utils'
import { getWallet } from '../wallet/selectors'
import { waitForWalletConnectionAndIdentityIfConnecting } from '../wallet/utils'
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
  buyItemCrossChainFailure
} from './actions'
import { getData as getItems } from './selectors'
import { Item } from './types'
import { getItem } from './utils'

export const NFT_SERVER_URL = config.get('NFT_SERVER_URL')
export const CANCEL_FETCH_ITEMS = 'CANCEL_FETCH_ITEMS'

export function* itemSaga(getIdentity: () => AuthIdentity | undefined) {
  const API_OPTS = {
    retries: retryParams.attempts,
    retryDelay: retryParams.delay,
    identity: getIdentity
  }
  const itemAPI = new ItemAPI(NFT_SERVER_URL, API_OPTS)
  const marketplaceItemAPI = new ItemAPI(MARKETPLACE_SERVER_URL, API_OPTS)
  const marketplaceServerCatalogAPI = new CatalogAPI(MARKETPLACE_SERVER_URL, API_OPTS)
  const catalogAPI = new CatalogAPI(NFT_SERVER_URL, API_OPTS)
  const tradeService = new TradeService(API_SIGNER, MARKETPLACE_SERVER_URL, getIdentity)

  yield fork(() => takeLatestByPath(FETCH_ITEMS_REQUEST, locations.browse()))
  yield takeEvery(FETCH_COLLECTION_ITEMS_REQUEST, handleFetchCollectionItemsRequest)
  yield takeEvery(FETCH_TRENDING_ITEMS_REQUEST, handleFetchTrendingItemsRequest)
  yield takeEvery(BUY_ITEM_REQUEST, handleBuyItem)
  yield takeEvery(BUY_ITEM_CROSS_CHAIN_REQUEST, handleBuyItemCrossChain)
  yield takeEvery(BUY_ITEM_WITH_CARD_REQUEST, handleBuyItemWithCardRequest)
  yield takeEvery(SET_PURCHASE, handleSetItemPurchaseWithCard)
  yield takeEvery(FETCH_ITEM_REQUEST, handleFetchItemRequest)

  // to avoid race conditions, just one fetch items request is handled at once in the browse page
  function* takeLatestByPath(actionType: string, path: string): SagaIterator {
    let task: Task<unknown> | undefined
    const history: History = yield getContext('history')

    while (true) {
      const action: FetchItemsRequestAction = yield take(actionType)
      const { pathname: currentPathname } = history.location

      // if we have a task running in the browse path, we cancel the previous one
      if (matchPath(currentPathname, { path }) && task && task.isRunning()) {
        yield put({ type: CANCEL_FETCH_ITEMS }) // to unblock the saga waiting for the identity success
        yield cancel(task)
      }
      task = yield fork(handleFetchItemsRequest, action)
    }
  }

  function* handleFetchTrendingItemsRequest(action: FetchTrendingItemsRequestAction) {
    const { size } = action.payload

    // If the wallet is getting connected, wait until it finishes to fetch the items so it can fetch them with authentication

    try {
      yield call(waitForFeatureFlagsToBeLoaded)
      const isMarketplaceServerEnabled: boolean = yield select(getIsMarketplaceServerEnabled)
      yield call(waitForWalletConnectionAndIdentityIfConnecting)
      const { data }: { data: Item[] } = yield call([isMarketplaceServerEnabled ? marketplaceItemAPI : itemAPI, 'getTrendings'], size)

      if (!data.length) {
        yield put(fetchTrendingItemsSuccess([]))
        return
      }

      const ids = data.map(item => item.id)
      const api = isMarketplaceServerEnabled ? marketplaceServerCatalogAPI : catalogAPI
      const isOffchainEnabled: boolean = yield select(getIsOffchainPublicNFTOrdersEnabled)
      const { data: itemData }: { data: Item[]; total: number } = yield call(
        [api, 'get'],
        {
          ids
        },
        { v2: isOffchainEnabled }
      )
      yield put(fetchTrendingItemsSuccess(itemData))
    } catch (error) {
      yield put(fetchTrendingItemsFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }

  function* handleFetchCollectionItemsRequest(action: FetchCollectionItemsRequestAction) {
    const { contractAddresses, first } = action.payload
    try {
      const isOffchainPublicItemOrdersEnabled: boolean = yield select(getIsOffchainPublicItemOrdersEnabled)
      const api = isOffchainPublicItemOrdersEnabled ? marketplaceItemAPI : itemAPI
      const { data }: { data: Item[]; total: number } = yield call([api, 'get'], { first, contractAddresses })
      yield put(fetchCollectionItemsSuccess(data))
    } catch (error) {
      yield put(fetchCollectionItemsFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }

  function* handleFetchItemsRequest(action: FetchItemsRequestAction): SagaIterator {
    const { filters, view } = action.payload

    try {
      // If the wallet is getting connected, wait until it finishes to fetch the wallet and generate the identity so it can fetch them with authentication
      yield call(waitForWalletConnectionAndIdentityIfConnecting)
      yield call(waitForFeatureFlagsToBeLoaded)
      const isMarketplaceServerEnabled: boolean = yield select(getIsMarketplaceServerEnabled)
      const isOffchainPublicItemOrdersEnabled: boolean = yield select(getIsOffchainPublicItemOrdersEnabled)
      const catalogViewAPI = isMarketplaceServerEnabled ? marketplaceServerCatalogAPI : catalogAPI
      const isOffchainEnabled: boolean = yield select(getIsOffchainPublicNFTOrdersEnabled)
      let data: Item[] = []
      let total: number = 0

      if (isCatalogView(view)) {
        const result: { data: Item[]; total: number } = yield call([catalogViewAPI, 'get'], filters as CatalogFilters, {
          v2: isOffchainEnabled
        })
        ;({ data, total } = result)
      } else {
        const result: { data: Item[]; total: number } = yield call(
          [isOffchainPublicItemOrdersEnabled ? marketplaceItemAPI : itemAPI, 'get'],
          filters
        )
        ;({ data, total } = result)
      }
      yield put(fetchItemsSuccess(data, total, action.payload, Date.now()))
    } catch (error) {
      yield put(fetchItemsFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error'), action.payload))
    } finally {
      if (yield cancelled()) {
        // if cancelled, we dispatch a failure action so it cleans the loading state
        yield put(fetchItemsFailure(FETCH_ITEMS_CANCELLED_ERROR_MESSAGE, action.payload))
      }
    }
  }

  function* handleFetchItemRequest(action: FetchItemRequestAction) {
    const { contractAddress, tokenId } = action.payload

    // If the wallet is getting connected, wait until it finishes to fetch the items so it can fetch them with authentication

    try {
      yield call(waitForWalletConnectionAndIdentityIfConnecting)
      const isOffchainPublicItemOrdersEnabled: boolean = yield select(getIsOffchainPublicItemOrdersEnabled)
      const api = isOffchainPublicItemOrdersEnabled ? marketplaceItemAPI : itemAPI
      const item: Item = yield call([api, 'getOne'], contractAddress, tokenId)
      const entity: Entity | null = yield call([peerAPI, 'fetchItemByUrn'], item.urn)
      if (entity) {
        item.entity = entity
      }
      yield put(fetchItemSuccess(item))
      if (item.data?.wearable?.isSmart && item.urn) {
        yield put(fetchSmartWearableRequiredPermissionsRequest(item))
      }
    } catch (error) {
      yield put(fetchItemFailure(contractAddress, tokenId, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }

  function* handleBuyItem(action: BuyItemRequestAction) {
    try {
      const { item, useCredits } = action.payload

      const wallet: ReturnType<typeof getWallet> = yield select(getWallet)

      if (!wallet) {
        throw new Error('A defined wallet is required to buy an item')
      }

      let txHash: string

      if (useCredits) {
        const isCreditsEnabled: boolean = yield select(getIsCreditsEnabled)
        if (!isCreditsEnabled) {
          throw new Error('Credits are not enabled')
        }
        const credits: CreditsResponse = yield select(getCredits, wallet?.address || '')
        if (!credits || credits.totalCredits <= 0) {
          throw new Error('No credits available')
        }
        const creditsService = new CreditsService()
        if (item.tradeId) {
          // Use credits for marketplace trade
          const trade: Trade = yield call([tradeService, 'fetchTrade'], item.tradeId)
          txHash = yield call([creditsService, 'useCreditsMarketplace'], trade, wallet.address, credits.credits)
        } else {
          // Use credits for collection store
          txHash = yield call([creditsService, 'useCreditsCollectionStore'], item, wallet.address, credits.credits)
        }
        const expectedBalance = BigInt(credits.totalCredits) - BigInt(item.price)
        yield put(pollCreditsBalanceRequest(wallet.address, expectedBalance))
      } else if (item.tradeId) {
        // Regular trade acceptance without credits
        const trade: Trade = yield call([tradeService, 'fetchTrade'], item.tradeId)
        txHash = yield call([tradeService, 'accept'], trade, wallet.address)
      } else {
        // Regular collection store purchase without credits
        const contract = getContract(ContractName.CollectionStore, item.chainId)

        txHash = yield call(sendTransaction, contract, collectionStore =>
          collectionStore.buy([[item.contractAddress, [item.itemId], [item.price], [wallet.address]]])
        )
      }

      yield put(buyItemSuccess(wallet.chainId, txHash, item))
    } catch (error) {
      console.log('error', error)
      yield put(buyItemFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
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
        const { AxelarProvider }: Awaited<typeof crossChainModule> = yield crossChainModule
        const crossChainProvider = new AxelarProvider(config.get('SQUID_API_URL'))
        const txResponse: ethers.providers.TransactionReceipt = yield call([crossChainProvider, 'executeRoute'], route, provider)

        yield put(buyItemCrossChainSuccess(route, Number(route.route.params.fromChain), txResponse.transactionHash, item, order))
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
      const { item, useCredits } = action.payload
      yield call(buyAssetWithCard, item, undefined, useCredits)
    } catch (error) {
      yield put(buyItemWithCardFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }

  function* handleSetItemPurchaseWithCard(action: SetPurchaseAction) {
    try {
      const { purchase } = action.payload
      const { status, txHash } = purchase

      if (isNFTPurchase(purchase) && purchase.nft.itemId && status === PurchaseStatus.COMPLETE && txHash) {
        const {
          nft: { contractAddress, itemId }
        } = purchase

        const items: ReturnType<typeof getItems> = yield select(getItems)
        let item: ReturnType<typeof getItem> = yield call(getItem, contractAddress, itemId, items)

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
      yield put(buyItemWithCardFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }
}
