import { createSelector } from 'reselect'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../reducer'
import { getAddress } from '../wallet/selectors'
import { FETCH_MORE_CANCELLED_TRADES_REQUEST } from './actions'

export const getState = (state: RootState) => state.cancelledTrades
export const getError = (state: RootState) => getState(state).error
export const getLoading = (state: RootState) => getState(state).loading

// Only trades fetched for the wallet that is connected now.
export const getCancelledTrades = createSelector(getState, getAddress, (state, address) =>
  address && state.address === address.toLowerCase() ? state.data : []
)

export const getCancelledTradesTotal = createSelector(getState, getAddress, (state, address) =>
  address && state.address === address.toLowerCase() ? state.total : 0
)

export const hasMoreCancelledTrades = createSelector(getCancelledTrades, getCancelledTradesTotal, (trades, total) => trades.length < total)

export const isLoadingMoreCancelledTrades = (state: RootState) => isLoadingType(getLoading(state), FETCH_MORE_CANCELLED_TRADES_REQUEST)
