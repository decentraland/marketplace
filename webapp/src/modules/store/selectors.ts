import { RootState } from '../reducer'

export const getState = (state: RootState) => state.store
export const getLocalStore = (state: RootState) => getState(state).localStore
