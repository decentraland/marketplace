import { createSelector } from 'reselect'
import { createMatchSelector } from 'connected-react-router'
import { locations } from '../routing/locations'
import { RootState } from '../reducer'

export const getState = (state: RootState) => state.item
export const getData = (state: RootState) => getState(state).data
export const getError = (state: RootState) => getState(state).error
export const getLoading = (state: RootState) => getState(state).loading

const itemDetailMatchSelector = createMatchSelector<
  RootState,
  {
    contractAddress: string
    tokenId: string
  }
>(locations.item(':contractAddress', ':tokenId'))

export const getContractAddress = createSelector<
  RootState,
  ReturnType<typeof itemDetailMatchSelector>,
  string | null
>(itemDetailMatchSelector, match => match?.params.contractAddress || null)

export const getTokenId = createSelector<
  RootState,
  ReturnType<typeof itemDetailMatchSelector>,
  string | null
>(itemDetailMatchSelector, match => match?.params.tokenId || null)
