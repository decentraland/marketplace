import { call, takeEvery, put, select } from '@redux-saga/core/effects'
import { fetchItemsRequest } from '../item/actions'
import { getItemsByContractAddress } from '../item/selectors'
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
  const { filters, shouldFetchItems } = action.payload

  try {
    const res: CollectionResponse = yield call(
      [collectionAPI, collectionAPI.fetch],
      filters
    )

    yield put(fetchCollectionsSuccess(res.data, res.total))

    if (shouldFetchItems) {
      const itemsByContractAddress: ReturnType<typeof getItemsByContractAddress> = yield select(
        getItemsByContractAddress
      )

      for (let collection of res.data) {
        const items = itemsByContractAddress[collection.contractAddress]

        if (!items || items.length !== collection.size) {
          yield put(
            fetchItemsRequest({
              filters: { contractAddress: collection.contractAddress }
            })
          )
        }
      }
    }
  } catch (error) {
    yield put(fetchCollectionsFailure(filters, error.message))
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
