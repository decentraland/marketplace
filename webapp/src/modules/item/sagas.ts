import { Item } from '@dcl/schemas'
import { put, takeEvery } from '@redux-saga/core/effects'
import {
  ContractData,
  ContractName,
  getContract
} from 'decentraland-transactions'
import { call, select } from 'redux-saga/effects'
import {
  CollectionStore,
  CollectionStoreTransactionReceipt
} from '../../contracts/CollectionStore'
import { ContractFactory } from '../contract/ContractFactory'
import { itemAPI } from '../vendor/decentraland/item/api'
import { getWallet } from '../wallet/selectors'
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
  BUY_ITEM_SUCCESS
} from './actions'
import { Address } from 'web3x-es/address'
import { sendTransaction } from '../wallet/utils'
import { TxSend } from 'web3x-es/contract'
import { push } from 'connected-react-router'
import { locations } from '../routing/locations'

export function* itemSaga() {
  yield takeEvery(FETCH_ITEMS_REQUEST, handleFetchItemsRequest)
  yield takeEvery(BUY_ITEM_REQUEST, handleBuyItem)
  yield takeEvery(FETCH_ITEM_REQUEST, handleFetchItemRequest)
  yield takeEvery(BUY_ITEM_SUCCESS, handleBuyItemSuccess)
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
    yield put(fetchItemsFailure(error.message, action.payload))
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
    yield put(fetchItemFailure(contractAddress, tokenId, error.message))
  }
}

function* handleBuyItem(action: BuyItemRequestAction) {
  try {
    const { item } = action.payload

    const wallet: ReturnType<typeof getWallet> = yield select(getWallet)

    if (!wallet) {
      throw new Error('A defined wallet is required to buy an item')
    }

    const collectionStoreContractConfig: ContractData = getContract(
      ContractName.CollectionStore,
      item.chainId
    )
    const collectionStoreContract: CollectionStore = yield call(
      [ContractFactory, 'build'],
      CollectionStore,
      collectionStoreContractConfig.address
    )

    const txBuy: TxSend<CollectionStoreTransactionReceipt> = yield call(
      collectionStoreContract.methods.buy,
      [
        {
          collection: Address.fromString(item.contractAddress),
          ids: [item.itemId],
          prices: [item.price],
          beneficiaries: [Address.fromString(wallet.address)]
        }
      ]
    )

    const txHash: string = yield call(
      sendTransaction,
      txBuy,
      collectionStoreContractConfig,
      Address.fromString(wallet.address)
    )

    yield put(buyItemSuccess(item.chainId, txHash, item))
  } catch (error) {
    yield put(buyItemFailure(error.message))
  }
}

function* handleBuyItemSuccess() {
  yield put(push(locations.activity()))
}
