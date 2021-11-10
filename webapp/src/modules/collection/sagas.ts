import { call, takeEvery, put } from '@redux-saga/core/effects'
import { collectionAPI } from '../vendor/decentraland'
import { CollectionResponse } from '../vendor/decentraland/collection/types'
import {
  fetchCollectionsFailure,
  FetchCollectionsRequestAction,
  fetchCollectionsSuccess,
  FETCH_COLLECTIONS_REQUEST
} from './actions'

export function* collectionSaga() {
  yield takeEvery(FETCH_COLLECTIONS_REQUEST, handleFetchCollectionsRequest)
}

export function* handleFetchCollectionsRequest(
  action: FetchCollectionsRequestAction
) {
  try {
    const res: CollectionResponse = yield call(
      [collectionAPI, collectionAPI.fetch],
      action.payload.filters
    )
    yield put(fetchCollectionsSuccess(res.data))
  } catch (error) {
    yield put(fetchCollectionsFailure(action.payload.filters, error.message))
  }
}
