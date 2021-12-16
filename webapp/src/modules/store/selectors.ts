import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { createSelector } from 'reselect'
import { RootState } from '../reducer'
import { Store } from './types'
import { getEmptyLocalStore } from './utils'

export const getState = (state: RootState) => state.store
export const getStoresByOwner = (state: RootState) => getState(state).data
export const getLocalStore = (state: RootState) => getState(state).localStore
export const getError = (state: RootState) => getState(state).error
export const getLoading = (state: RootState) => getState(state).loading

export const getBaseStore = createSelector<
  RootState,
  string | undefined,
  ReturnType<typeof getStoresByOwner>,
  Store
>(getAddress, getStoresByOwner, (address, storesByOwner) => {
  return (address && storesByOwner[address]) || getEmptyLocalStore()
})
