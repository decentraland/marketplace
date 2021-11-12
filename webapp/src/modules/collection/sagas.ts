import { call, takeEvery, put } from '@redux-saga/core/effects'
import { collectionAPI } from '../vendor/decentraland'
import { CollectionResponse } from '../vendor/decentraland/collection/types'
import {
  fetchCollectionTotalFailure,
  FetchCollectionTotalRequestAction,
  fetchCollectionTotalSuccess,
  fetchCollectionsFailure,
  FetchCollectionsRequestAction,
  fetchCollectionsSuccess,
  FETCH_COLLECTIONS_REQUEST,
  FETCH_COLLECTION_TOTAL_REQUEST
} from './actions'

export function* collectionSaga() {
  yield takeEvery(FETCH_COLLECTIONS_REQUEST, handleFetchCollectionsRequest)
  yield takeEvery(
    FETCH_COLLECTION_TOTAL_REQUEST,
    handleFetchCollectionTotalRequest
  )
}

export function* handleFetchCollectionsRequest(
  action: FetchCollectionsRequestAction
) {
  try {
    const res: CollectionResponse = yield call(
      [collectionAPI, collectionAPI.fetch],
      action.payload.filters
    )
    yield put(fetchCollectionsSuccess(res.data, res.total))
  } catch (error) {
    yield put(fetchCollectionsFailure(action.payload.filters, error.message))
  }
}

export function* handleFetchCollectionTotalRequest(
  action: FetchCollectionTotalRequestAction
) {
  try {
    const res: CollectionResponse = yield call(
      [collectionAPI, collectionAPI.fetch],
      action.payload.filters
    )
    yield put(fetchCollectionTotalSuccess(res.total))
  } catch (error) {
    yield put(
      fetchCollectionTotalFailure(action.payload.filters, error.message)
    )
  }
}
