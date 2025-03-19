import { createSelector } from 'reselect'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../reducer'
import { FETCH_CREDITS_REQUEST } from './actions'

export const getState = (state: RootState) => state.credits

export const getData = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error

export const isFetchingCredits = createSelector(getLoading, loading => isLoadingType(loading, FETCH_CREDITS_REQUEST))

export const getCredits = (state: RootState, address: string) => getData(state)[address]
