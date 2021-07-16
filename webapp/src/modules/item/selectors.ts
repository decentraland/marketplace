import { RootState } from '../reducer'

export const getState = (state: RootState) => state.item
export const getData = (state: RootState) => getState(state).data
export const getError = (state: RootState) => getState(state).error
export const getLoading = (state: RootState) => getState(state).loading
