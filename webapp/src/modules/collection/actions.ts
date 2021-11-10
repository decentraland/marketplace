import { Collection, CollectionFilters } from '@dcl/schemas'
import { action } from 'typesafe-actions'

export const FETCH_COLLECTIONS_REQUEST = '[Request] Fetch collections'
export const FETCH_COLLECTIONS_SUCCESS = '[Success] Fetch collections'
export const FETCH_COLLECTIONS_FAILURE = '[Failure] Fetch collections'

export const fetchCollectionsRequest = (filters: CollectionFilters) =>
  action(FETCH_COLLECTIONS_REQUEST, { filters })
export const fetchCollectionsSuccess = (collections: Collection[]) =>
  action(FETCH_COLLECTIONS_SUCCESS, { collections })
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
