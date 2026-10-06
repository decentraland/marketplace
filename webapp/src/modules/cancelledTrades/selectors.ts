import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../reducer'
import { FETCH_CANCELLED_TRADES_REQUEST } from './actions'

export const getState = (state: RootState) => state.cancelledTrades
export const getCancelledTrades = (state: RootState) => getState(state).data
export const getCancelledTradesTotal = (state: RootState) => getState(state).total
export const getError = (state: RootState) => getState(state).error
export const getLoading = (state: RootState) => getState(state).loading

export const hasMoreCancelledTrades = (state: RootState) => getCancelledTrades(state).length < getCancelledTradesTotal(state)
export const isLoadingCancelledTrades = (state: RootState) => isLoadingType(getLoading(state), FETCH_CANCELLED_TRADES_REQUEST)
