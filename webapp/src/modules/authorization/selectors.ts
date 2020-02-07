import { createSelector } from 'reselect'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { RootState } from '../reducer'
import { getTransactionsByType } from '../transaction/selectors'
import { getAddress } from '../wallet/selectors'
import { ALLOW_TOKEN_SUCCESS, APPROVE_TOKEN_SUCCESS } from './actions'
import { AuthorizationState, EMPTY_ADDRESS_STATE } from './reducer'
import { Authorizations } from './types'

export const getState = (state: RootState) => state.authorization
export const getData = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const isLoading = (state: RootState) => getLoading(state).length > 0
export const getError = (state: RootState) => getState(state).error

export const getAllowTransactions = (state: RootState) =>
  getTransactionsByType(state, getAddress(state) || '', ALLOW_TOKEN_SUCCESS)
export const getApproveTransactions = (state: RootState) =>
  getTransactionsByType(state, getAddress(state) || '', APPROVE_TOKEN_SUCCESS)

export const getAuthorizations = createSelector<
  RootState,
  AuthorizationState['data'],
  string | undefined,
  Authorizations
>(getData, getAddress, (data, address) =>
  address && address in data ? data[address] : EMPTY_ADDRESS_STATE
)

export const getPendingTransactions = createSelector<
  RootState,
  Transaction[],
  Transaction[],
  Transaction[]
>(
  getAllowTransactions,
  getApproveTransactions,
  (allowTransactions, approveTransactions) =>
    [...allowTransactions, ...approveTransactions].filter(tx =>
      isPending(tx.status)
    )
)
