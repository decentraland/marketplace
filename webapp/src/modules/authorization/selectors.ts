import { RootState } from '../reducer'
import { getTransactionsByType } from '../transaction/selectors'
import { getAddress } from '../wallet/selectors'
import { ALLOW_TOKEN_SUCCESS, APPROVE_TOKEN_SUCCESS } from './actions'

export const getState = (state: RootState) => state.authorization
export const getData = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const isLoading = (state: RootState) => getLoading(state).length > 0
export const getError = (state: RootState) => getState(state).error

export const getAllowTransactions = (state: RootState) =>
  getTransactionsByType(state, getAddress(state) || '', ALLOW_TOKEN_SUCCESS)
export const getApproveTransactions = (state: RootState) =>
  getTransactionsByType(state, getAddress(state) || '', APPROVE_TOKEN_SUCCESS)
