import { takeEvery, put } from '@redux-saga/core/effects'
import {
  fetchStoreFailure,
  FetchStoreRequestAction,
  fetchStoreSuccess,
  FETCH_STORE_REQUEST,
  upsertStoreFailure,
  UpsertStoreRequestAction,
  upsertStoreSuccess,
  UPSERT_STORE_REQUEST
} from './actions'

export function* storeSaga() {
  yield takeEvery(FETCH_STORE_REQUEST, handleFetchStoreRequest)
  yield takeEvery(UPSERT_STORE_REQUEST, handleUpsertStoreRequest)
}

export function* handleFetchStoreRequest(action: FetchStoreRequestAction) {
  const { address } = action.payload

  try {
    const serializedStore = localStorage.getItem(`store-${address}`)

    if (!serializedStore) {
      throw new Error('Store not found')
    }

    const store = JSON.parse(serializedStore)

    yield put(fetchStoreSuccess(store))
  } catch (error) {
    yield put(fetchStoreFailure(error.message))
  }
}

export function* handleUpsertStoreRequest(action: UpsertStoreRequestAction) {
  const { store } = action.payload

  try {
    localStorage.setItem(`store-${store.owner}`, JSON.stringify(store))
    yield put(upsertStoreSuccess(store))
  } catch (error) {
    yield put(upsertStoreFailure(error.message))
  }
}
