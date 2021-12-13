import { Store } from '@dcl/schemas'
import { action } from 'typesafe-actions'

// Fetch Store

export const FETCH_STORE_REQUEST = '[Request] Fetch store'
export const FETCH_STORE_SUCCESS = '[Success] Fetch store'
export const FETCH_STORE_FAILURE = '[Failure] Fetch store'

export const fetchStoreRequest = (address: string) =>
  action(FETCH_STORE_REQUEST, { address })
export const fetchStoreSuccess = (store: Store) =>
  action(FETCH_STORE_SUCCESS, { store })
export const fetchStoreFailure = (error: string) =>
  action(FETCH_STORE_FAILURE, { error })

export type FetchStoreRequestAction = ReturnType<typeof fetchStoreRequest>
export type FetchStoreSuccessAction = ReturnType<typeof fetchStoreSuccess>
export type FetchStoreFailureAction = ReturnType<typeof fetchStoreFailure>

// Upsert Store

export const UPSERT_STORE_REQUEST = '[Request] Upsert store'
export const UPSERT_STORE_SUCCESS = '[Success] Upsert store'
export const UPSERT_STORE_FAILURE = '[Failure] Upsert store'

export const upsertStoreRequest = (store: Store) =>
  action(UPSERT_STORE_REQUEST, { store })
export const upsertStoreSuccess = (store: Store) =>
  action(UPSERT_STORE_SUCCESS, { store })
export const upsertStoreFailure = (error: string) =>
  action(UPSERT_STORE_FAILURE, { error })

export type UpsertStoreRequestAction = ReturnType<typeof upsertStoreRequest>
export type UpsertStoreSuccessAction = ReturnType<typeof upsertStoreSuccess>
export type UpsertStoreFailureAction = ReturnType<typeof upsertStoreFailure>
