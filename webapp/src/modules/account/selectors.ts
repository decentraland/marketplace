import { createSelector } from 'reselect'
import { createMatchSelector } from 'connected-react-router'

import { RootState } from '../reducer'
import { locations } from '../routing/locations'

export const getState = (state: RootState) => state.account
export const getData = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error

const accountMatchSelector = createMatchSelector<
  RootState,
  { address: string }
>(locations.account(':address'))

export const getAddress = createSelector<
  RootState,
  ReturnType<typeof accountMatchSelector>,
  string | undefined
>(accountMatchSelector, match => match?.params.address?.toLowerCase())
