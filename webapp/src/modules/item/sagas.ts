import { ChainId, Item, Network } from '@dcl/schemas'
import { put, takeEvery } from '@redux-saga/core/effects'
import { ContractName, getContract } from 'decentraland-transactions'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { call, select } from 'redux-saga/effects'
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
  setPriceAndBeneficiarySuccess,
  setPriceAndBeneficiaryFailure,
  SetPriceAndBeneficiaryRequestAction,
  SET_PRICE_AND_BENEFICIARY_REQUEST
} from './actions'
import { getItems } from './selectors'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getChainIdByNetwork } from 'decentraland-dapps/dist/lib/eth'
import { getMetadata } from './utils'
import { constants } from 'ethers'

export function* itemSaga() {
  yield takeEvery(FETCH_ITEMS_REQUEST, handleFetchItemsRequest)
  yield takeEvery(BUY_ITEM_REQUEST, handleBuyItem)
  yield takeEvery(FETCH_ITEM_REQUEST, handleFetchItemRequest)
  yield takeEvery(
    SET_PRICE_AND_BENEFICIARY_REQUEST,
    handleSetPriceAndBeneficiaryRequest
  )
}

function* handleSetPriceAndBeneficiaryRequest(
  action: SetPriceAndBeneficiaryRequestAction
) {
  const { itemId, price, beneficiary } = action.payload
  try {
    const items: ReturnType<typeof getItems> = yield select(getItems)
    const item = items.find(item => item.id === itemId)

    if (!item) {
      throw new Error(yield call(t, 'sagas.item.not_found'))
    }

    const newItem = { ...item, price, beneficiary, updatedAt: Date.now() }

    const metadata = getMetadata(newItem)
    const chainId: ChainId = yield call(getChainIdByNetwork, Network.MATIC)
    const contract = {
      ...getContract(ContractName.ERC721CollectionV2, chainId),
      address: item.contractAddress!
    }
    const newPrice =
      newItem.price === '0' ? constants.MaxUint256 : newItem.price
    const txHash: string = yield call(sendTransaction, contract, collection =>
      collection.editItemsData(
        [newItem.itemId],
        [newPrice],
        [newItem.beneficiary!],
        [metadata]
      )
    )

    yield put(setPriceAndBeneficiarySuccess(newItem, chainId, txHash))
  } catch (error) {
    yield put(
      setPriceAndBeneficiaryFailure(itemId, price, beneficiary, error.message)
    )
  }
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
    yield put(buyItemFailure(error.message))
  }
}
