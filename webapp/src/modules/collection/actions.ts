import { Collection, CollectionFilters } from '@dcl/schemas'
import { action } from 'typesafe-actions'

// FETCH COLLECTIONS

export const FETCH_COLLECTIONS_REQUEST = '[Request] Fetch collections'
export const FETCH_COLLECTIONS_SUCCESS = '[Success] Fetch collections'
export const FETCH_COLLECTIONS_FAILURE = '[Failure] Fetch collections'

export const fetchCollectionsRequest = (filters: CollectionFilters, shouldFetchItems?: boolean) =>
  action(FETCH_COLLECTIONS_REQUEST, { filters, shouldFetchItems })
export const fetchCollectionsSuccess = (collections: Collection[], count: number) =>
  action(FETCH_COLLECTIONS_SUCCESS, {
    collections,
    count
  })
export const fetchCollectionsFailure = (error: string) => action(FETCH_COLLECTIONS_FAILURE, { error })

export type FetchCollectionsRequestAction = ReturnType<typeof fetchCollectionsRequest>
export type FetchCollectionsSuccessAction = ReturnType<typeof fetchCollectionsSuccess>
export type FetchCollectionsFailureAction = ReturnType<typeof fetchCollectionsFailure>

// FETCH SINGLE COLLECTION

export const FETCH_SINGLE_COLLECTION_REQUEST = '[Request] Fetch single collection'
export const FETCH_SINGLE_COLLECTION_SUCCESS = '[Success] Fetch single collection'
export const FETCH_SINGLE_COLLECTION_FAILURE = '[Failure] Fetch single collection'

export const fetchSingleCollectionRequest = (contractAddress: string, shouldFetchItems?: boolean) =>
  action(FETCH_SINGLE_COLLECTION_REQUEST, {
    contractAddress,
    shouldFetchItems
  })
export const fetchSingleCollectionSuccess = (collection: Collection) =>
  action(FETCH_SINGLE_COLLECTION_SUCCESS, {
    collection
  })
export const fetchSingleCollectionFailure = (error: string) =>
  action(FETCH_SINGLE_COLLECTION_FAILURE, {
    error
  })

export type FetchSingleCollectionRequestAction = ReturnType<typeof fetchSingleCollectionRequest>
export type FetchSingleCollectionSuccessAction = ReturnType<typeof fetchSingleCollectionSuccess>
export type FetchSingleCollectionFailureAction = ReturnType<typeof fetchSingleCollectionFailure>
