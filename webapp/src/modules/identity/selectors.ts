import { createSelector } from 'reselect'
import { RootState } from '../reducer'
import { getAddress } from '../wallet/selectors'
import { isValid } from './utils'

export const getState = (state: RootState) => state.identity
export const getData = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error

export const getCurrentIdentity = createSelector(getData, getAddress, (identities, address) => {
  if (!address) {
    return null
  }

  const identity = identities[address]

  if (!isValid(identity)) {
    return null
  }

  return identity
})
