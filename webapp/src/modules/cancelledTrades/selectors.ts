import { createSelector } from 'reselect'
import { RootState } from '../reducer'
import { getAddress } from '../wallet/selectors'

export const getState = (state: RootState) => state.cancelledTrades
export const getError = (state: RootState) => getState(state).error

// Only trades fetched for the wallet that is connected now.
export const getCancelledTrades = createSelector(getState, getAddress, (state, address) =>
  address && state.address === address.toLowerCase() ? state.data : []
)

export const getCancelledTradesTotal = createSelector(getState, getAddress, (state, address) =>
  address && state.address === address.toLowerCase() ? state.total : 0
)
