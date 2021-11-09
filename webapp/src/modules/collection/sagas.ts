import { takeEvery } from '@redux-saga/core/effects'
import { FETCH_COLLECTIONS_REQUEST } from './actions'

export function* collectionSaga() {
  yield takeEvery(FETCH_COLLECTIONS_REQUEST, handleFetchCollectionsRequest)
}

export function* handleFetchCollectionsRequest() {}
