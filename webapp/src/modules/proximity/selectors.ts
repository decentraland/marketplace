import { RootState } from '../reducer'

export const getState = (state: RootState) => state.proximity
export const getProximities = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error
