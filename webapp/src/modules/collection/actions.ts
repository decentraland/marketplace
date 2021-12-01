import { Collection, CollectionFilters } from '@dcl/schemas'
import { action } from 'typesafe-actions'

// FETCH COLLECTIONS

export const FETCH_COLLECTIONS_REQUEST = '[Request] Fetch collections'
export const FETCH_COLLECTIONS_SUCCESS = '[Success] Fetch collections'
export const FETCH_COLLECTIONS_FAILURE = '[Failure] Fetch collections'

export const fetchCollectionsRequest = (
  filters: CollectionFilters,
  shouldFetchItems?: boolean
) => action(FETCH_COLLECTIONS_REQUEST, { filters, shouldFetchItems })
export const fetchCollectionsSuccess = (
  filters: CollectionFilters,
  collections: Collection[],
  count: number,
  shouldFetchItems?: boolean
) =>
  action(FETCH_COLLECTIONS_SUCCESS, {
    filters,
    shouldFetchItems,
    collections,
    count
  })
export const fetchCollectionsFailure = (
  filters: CollectionFilters,
  error: string,
  shouldFetchItems?: boolean
) => action(FETCH_COLLECTIONS_FAILURE, { filters, shouldFetchItems, error })

export type FetchCollectionsRequestAction = ReturnType<
  typeof fetchCollectionsRequest
>
export type FetchCollectionsSuccessAction = ReturnType<
  typeof fetchCollectionsSuccess
>
export type FetchCollectionsFailureAction = ReturnType<
  typeof fetchCollectionsFailure
>

// FETCH SINGLE COLLECTION

export const FETCH_SINGLE_COLLECTION_REQUEST =
  '[Request] Fetch single collection'
export const FETCH_SINGLE_COLLECTION_SUCCESS =
  '[Success] Fetch single collection'
export const FETCH_SINGLE_COLLECTION_FAILURE =
  '[Failure] Fetch single collection'

export const fetchSingleCollectionRequest = (
  contractAddress: string,
  shouldFetchItems?: boolean
) =>
  action(FETCH_SINGLE_COLLECTION_REQUEST, { contractAddress, shouldFetchItems })
export const fetchSingleCollectionSuccess = (
  contractAddress: string,
  collection: Collection,
  shouldFetchItems?: boolean
) =>
  action(FETCH_SINGLE_COLLECTION_SUCCESS, {
    contractAddress,
    shouldFetchItems,
    collection
  })
export const fetchSingleCollectionFailure = (
  contractAddress: string,
  error: string,
  shouldFetchItems?: boolean
) =>
  action(FETCH_SINGLE_COLLECTION_FAILURE, {
    contractAddress,
    shouldFetchItems,
    error
  })

export type FetchSingleCollectionRequestAction = ReturnType<
  typeof fetchSingleCollectionRequest
>
export type FetchSingleCollectionSuccessAction = ReturnType<
  typeof fetchSingleCollectionSuccess
>
export type FetchSingleCollectionFailureAction = ReturnType<
  typeof fetchSingleCollectionFailure
>
