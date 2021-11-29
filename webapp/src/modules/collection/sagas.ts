import { call, takeEvery, put, select } from '@redux-saga/core/effects'
import { fetchItemsRequest } from '../item/actions'
import { getItemsByContractAddress } from '../item/selectors'
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
  const { filters, shouldFetchItems } = action.payload

  try {
    const { data: collections, total }: CollectionResponse = yield call(
      [collectionAPI, collectionAPI.fetch],
      filters
    )

    yield put(fetchCollectionsSuccess(collections, total))

    if (shouldFetchItems) {
      const itemsByContractAddress: ReturnType<typeof getItemsByContractAddress> = yield select(
        getItemsByContractAddress
      )

      for (let collection of collections) {
        const items = itemsByContractAddress[collection.contractAddress]

        if (!items || items.length !== collection.size) {
          yield put(
            fetchItemsRequest({
              filters: {
                first: collection.size,
                contractAddress: collection.contractAddress
              }
            })
          )
        }
      }
    }
  } catch (error) {
    yield put(fetchCollectionsFailure(filters, error.message))
  }
}
