import { action } from 'typesafe-actions'
import { Store } from './types'

// Fetch Store

export const FETCH_STORE_REQUEST = '[Request] Fetch store'
export const FETCH_STORE_SUCCESS = '[Success] Fetch store'
export const FETCH_STORE_FAILURE = '[Failure] Fetch store'

export const fetchStoreRequest = (address: string) =>
  action(FETCH_STORE_REQUEST, { address })
export const fetchStoreSuccess = (store?: Store) =>
  action(FETCH_STORE_SUCCESS, { store })
export const fetchStoreFailure = (error: string) =>
  action(FETCH_STORE_FAILURE, { error })

export type FetchStoreRequestAction = ReturnType<typeof fetchStoreRequest>
export type FetchStoreSuccessAction = ReturnType<typeof fetchStoreSuccess>
export type FetchStoreFailureAction = ReturnType<typeof fetchStoreFailure>

// Update Store

export const UPDATE_STORE_REQUEST = '[Request] Update store'
export const UPDATE_STORE_SUCCESS = '[Success] Update store'
export const UPDATE_STORE_FAILURE = '[Failure] Update store'

export const updateStoreRequest = (store: Store) =>
  action(UPDATE_STORE_REQUEST, { store })
export const updateStoreSuccess = (store: Store) =>
  action(UPDATE_STORE_SUCCESS, { store })
export const updateStoreFailure = (error: string) =>
  action(UPDATE_STORE_FAILURE, { error })

export type UpdateStoreRequestAction = ReturnType<typeof updateStoreRequest>
export type UpdateStoreSuccessAction = ReturnType<typeof updateStoreSuccess>
export type UpdateStoreFailureAction = ReturnType<typeof updateStoreFailure>

// Update Local Store

export const UPDATE_LOCAL_STORE = 'Update local store'

export const updateLocalStore = (store: Store | null) =>
  action(UPDATE_LOCAL_STORE, { store: store })

export type UpdateLocalStoreAction = ReturnType<typeof updateLocalStore>

// Revert Local Store

export const REVERT_LOCAL_STORE = 'Revert local store'

export const revertLocalStore = (address: string) =>
  action(REVERT_LOCAL_STORE, { address })

export type RevertLocalStoreAction = ReturnType<typeof revertLocalStore>
