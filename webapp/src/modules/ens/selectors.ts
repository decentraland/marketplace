import { createSelector } from 'reselect'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { AuthorizationStepStatus } from 'decentraland-ui'
import { getPendingTransactions } from '../transaction/selectors'
import { RootState } from '../reducer'
import { CLAIM_NAME_REQUEST, CLAIM_NAME_TRANSACTION_SUBMITTED } from './actions'

export const getState = (state: RootState) => state.ens
export const getData = (state: RootState) => getState(state).data
export const getAuthorizations = (state: RootState) => getState(state).authorizations
export const getError = (state: RootState) => getState(state).error
export const getLoading = (state: RootState) => getState(state).loading

export const isWaitingTxClaimName = createSelector<RootState, Transaction[], boolean>(getPendingTransactions, transactions =>
  transactions.some(transaction => CLAIM_NAME_TRANSACTION_SUBMITTED === transaction.actionType)
)

export const getClaimNameStatus = (state: RootState) => {
  if (isLoadingType(getLoading(state), CLAIM_NAME_REQUEST)) {
    return AuthorizationStepStatus.WAITING
  }

  if (isWaitingTxClaimName(state)) {
    return AuthorizationStepStatus.PROCESSING
  }

  if (getError(state)) {
    return AuthorizationStepStatus.ERROR
  }

  return AuthorizationStepStatus.PENDING
}

export const getErrorMessage = (state: RootState) => {
  const error = getError(state)
  if (error) {
    return error.message
  }

  return null
}
