import { action } from 'typesafe-actions'
import { Store } from './types'

// Update Local Store

export const UPDATE_LOCAL_STORE = 'Update local store'

export const updateLocalStore = (store: Store | null) =>
  action(UPDATE_LOCAL_STORE, { store: store })

export type UpdateLocalStoreAction = ReturnType<typeof updateLocalStore>

// Revert Local Store

export const REVERT_LOCAL_STORE = 'Revert local store'

export const revertLocalStore = () => action(REVERT_LOCAL_STORE)

export type RevertLocalStoreAction = ReturnType<typeof revertLocalStore>
