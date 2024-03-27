import { call, takeEvery, put, select } from '@redux-saga/core/effects'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from '../../lib/error'
import { fetchCollectionItemsRequest } from '../item/actions'
import { getItemsByContractAddress } from '../item/selectors'
import { collectionAPI } from '../vendor/decentraland'
import { CollectionResponse } from '../vendor/decentraland/collection/types'
import {
  fetchCollectionsFailure,
  FetchCollectionsRequestAction,
  fetchCollectionsSuccess,
  fetchSingleCollectionFailure,
  FetchSingleCollectionRequestAction,
  fetchSingleCollectionSuccess,
  FETCH_COLLECTIONS_REQUEST,
  FETCH_SINGLE_COLLECTION_REQUEST
} from './actions'

export function* collectionSaga() {
  yield takeEvery(FETCH_COLLECTIONS_REQUEST, handleFetchCollectionsRequest)
  yield takeEvery(FETCH_SINGLE_COLLECTION_REQUEST, handleFetchSingleCollectionRequest)
}

export function* handleFetchCollectionsRequest(action: FetchCollectionsRequestAction) {
  const { filters, shouldFetchItems } = action.payload

  try {
    const { data: collections, total }: CollectionResponse = (yield call([collectionAPI, collectionAPI.fetch], filters)) as Awaited<
      ReturnType<typeof collectionAPI.fetch>
    >

    yield put(fetchCollectionsSuccess(collections, total))

    if (shouldFetchItems) {
      const itemsByContractAddress = (yield select(getItemsByContractAddress)) as ReturnType<typeof getItemsByContractAddress>

      for (const collection of collections) {
        const items = itemsByContractAddress[collection.contractAddress]

        if (!items || items.length !== collection.size) {
          yield put(
            fetchCollectionItemsRequest({
              first: collection.size,
              contractAddresses: [collection.contractAddress]
            })
          )
        }
      }
    }
  } catch (error) {
    yield put(fetchCollectionsFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}

export function* handleFetchSingleCollectionRequest(action: FetchSingleCollectionRequestAction) {
  const { contractAddress, shouldFetchItems } = action.payload

  try {
    const { data: collections } = (yield call([collectionAPI, collectionAPI.fetch], { contractAddress })) as Awaited<
      ReturnType<typeof collectionAPI.fetch>
    >

    if (collections.length === 0) {
      yield put(fetchSingleCollectionFailure(`Could not get Collection "${contractAddress}"`))
      return
    }

    const [collection] = collections

    if (shouldFetchItems) {
      const itemsByContractAddress = (yield select(getItemsByContractAddress)) as ReturnType<typeof getItemsByContractAddress>

      const items = itemsByContractAddress[collection.contractAddress]

      if (!items || items.length !== collection.size) {
        yield put(
          fetchCollectionItemsRequest({
            first: collection.size,
            contractAddresses: [collection.contractAddress]
          })
        )
      }
    }
    yield put(fetchSingleCollectionSuccess(collection))
  } catch (error) {
    yield put(fetchSingleCollectionFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}
