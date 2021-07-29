import { Item } from '@dcl/schemas'
import { put, takeEvery } from '@redux-saga/core/effects'
import { call } from 'redux-saga/effects'
import { itemAPI } from '../vendor/decentraland/item/api'
import {
  fetchItemsFailure,
  FetchItemsRequestAction,
  fetchItemsSuccess,
  FETCH_ITEMS_REQUEST,
  fetchItemFailure,
  FetchItemRequestAction,
  fetchItemSuccess,
  FETCH_ITEM_REQUEST
} from './actions'

export function* itemSaga() {
  yield takeEvery(FETCH_ITEMS_REQUEST, handleFetchItemsRequest)
  yield takeEvery(FETCH_ITEM_REQUEST, handleFetchItemRequest)
}

function* handleFetchItemsRequest(action: FetchItemsRequestAction) {
  const { filters } = action.payload
  try {
    const { data, total }: { data: Item[]; total: number } = yield call(() =>
      itemAPI.fetch(filters)
    )
    yield put(fetchItemsSuccess(data, total, action.payload, Date.now()))
  } catch (error) {
    yield put(fetchItemsFailure(error.message, action.payload))
  }
}

function* handleFetchItemRequest(action: FetchItemRequestAction) {
  const { contractAddress, tokenId } = action.payload
  try {
    const item: Item = yield call(() =>
      itemAPI.fetchOne(contractAddress, tokenId)
    )
    yield put(fetchItemSuccess(item))
  } catch (error) {
    yield put(fetchItemFailure(contractAddress, tokenId, error.message))
  }
}
