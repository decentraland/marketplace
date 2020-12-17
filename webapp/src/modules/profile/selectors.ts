import { RootState } from '../reducer'
import { ProfileState } from './reducer'

export const getState: (state: RootState) => ProfileState = state =>
  state.profile

export const getData: (state: RootState) => ProfileState['data'] = state =>
  getState(state).data

export const getError: (state: RootState) => ProfileState['error'] = state =>
  getState(state).error

export const getLoading = (state: RootState) => getState(state).loading
