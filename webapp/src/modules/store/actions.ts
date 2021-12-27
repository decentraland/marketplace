import { action } from 'typesafe-actions'
import { Store } from './types'

// Update Store

export const UPDATE_STORE_REQUEST = '[Request] Update store'
export const UPDATE_STORE_SUCCESS = '[Success] Update store'
export const UPDATE_STORE_FAILURE = '[Failure] Update store'

export const updateStoreRequest = () => action(UPDATE_STORE_REQUEST)
export const updateStoreSuccess = () => action(UPDATE_STORE_SUCCESS)
export const updateStoreFailure = () => action(UPDATE_STORE_FAILURE)

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

export const revertLocalStore = () => action(REVERT_LOCAL_STORE)

export type RevertLocalStoreAction = ReturnType<typeof revertLocalStore>
