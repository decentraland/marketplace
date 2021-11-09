import { action } from 'typesafe-actions'
import { Collection } from './types'

export const FETCH_COLLECTIONS_REQUEST = '[Request] Fetch collections'
export const FETCH_COLLECTIONS_SUCCESS = '[Success] Fetch collections'
export const FETCH_COLLECTIONS_FAILURE = '[Failure] Fetch collections'

export const fetchCollectionsRequest = () => action(FETCH_COLLECTIONS_REQUEST)
export const fetchCollectionsSuccess = (collections: Collection[]) =>
  action(FETCH_COLLECTIONS_SUCCESS, { collections })
export const fetchCollectionsFailure = (error: string) =>
  action(FETCH_COLLECTIONS_FAILURE, { error })

export type FetchCollectionsRequestAction = ReturnType<
  typeof fetchCollectionsRequest
>
export type FetchCollectionsSuccessAction = ReturnType<
  typeof fetchCollectionsSuccess
>
export type FetchCollectionsFailureAction = ReturnType<
  typeof fetchCollectionsFailure
>
