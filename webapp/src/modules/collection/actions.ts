import { Collection, CollectionFilters } from '@dcl/schemas'
import { action } from 'typesafe-actions'

export const FETCH_COLLECTIONS_REQUEST = '[Request] Fetch collections'
export const FETCH_COLLECTIONS_SUCCESS = '[Success] Fetch collections'
export const FETCH_COLLECTIONS_FAILURE = '[Failure] Fetch collections'

export const fetchCollectionsRequest = (
  filters: CollectionFilters,
  shouldFetchItems?: boolean
) => action(FETCH_COLLECTIONS_REQUEST, { filters, shouldFetchItems })
export const fetchCollectionsSuccess = (
  collections: Collection[],
  count: number
) => action(FETCH_COLLECTIONS_SUCCESS, { collections, count })
export const fetchCollectionsFailure = (
  filters: CollectionFilters,
  error: string
) => action(FETCH_COLLECTIONS_FAILURE, { error, filters })

export type FetchCollectionsRequestAction = ReturnType<
  typeof fetchCollectionsRequest
>
export type FetchCollectionsSuccessAction = ReturnType<
  typeof fetchCollectionsSuccess
>
export type FetchCollectionsFailureAction = ReturnType<
  typeof fetchCollectionsFailure
>

export const FETCH_COLLECTION_TOTAL_REQUEST = '[Request] Fetch collection total'
export const FETCH_COLLECTION_TOTAL_SUCCESS = '[Success] Fetch collection total'
export const FETCH_COLLECTION_TOTAL_FAILURE = '[Failure] Fetch collection total'

export const fetchCollectionTotalRequest = (filters: CollectionFilters) =>
  action(FETCH_COLLECTION_TOTAL_REQUEST, { filters })
export const fetchCollectionTotalSuccess = (total: number) =>
  action(FETCH_COLLECTION_TOTAL_SUCCESS, { total })
export const fetchCollectionTotalFailure = (
  filters: CollectionFilters,
  error: string
) => action(FETCH_COLLECTION_TOTAL_FAILURE, { error, filters })

export type FetchCollectionTotalRequestAction = ReturnType<
  typeof fetchCollectionTotalRequest
>
export type FetchCollectionTotalSuccessAction = ReturnType<
  typeof fetchCollectionTotalSuccess
>
export type FetchCollectionTotalFailureAction = ReturnType<
  typeof fetchCollectionTotalFailure
>
