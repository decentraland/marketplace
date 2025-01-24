import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../reducer'
import { FETCH_EVENT_REQUEST } from './actions'

export const getState = (state: RootState) => state.event
export const getData = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error

export const isFetchingEvent = (state: RootState) => isLoadingType(getLoading(state), FETCH_EVENT_REQUEST)
