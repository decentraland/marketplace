import { createSelector } from 'reselect'
import { GRANT_TOKEN_SUCCESS, REVOKE_TOKEN_SUCCESS } from 'decentraland-dapps/dist/modules/authorization/actions'
import { getData } from 'decentraland-dapps/dist/modules/transaction/selectors'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import { RootState } from '../reducer'
import { getAddress } from '../wallet/selectors'

export const getTransactionsByType = (state: RootState, address: string, type: string): Transaction[] =>
  getData(state).filter(tx => tx.from.toLowerCase() === address && tx.actionType === type)

export const getTransactions = createSelector<RootState, Transaction[], string | undefined, Transaction[]>(
  getData,
  getAddress,
  (transactions, address) => transactions.filter(transaction => !!address && transaction.from.toLowerCase() === address.toLowerCase())
)

export const getPendingAuthorizationTransactions = createSelector<RootState, Transaction[], Transaction[]>(getTransactions, transactions =>
  transactions.filter(
    transaction =>
      isPending(transaction.status) && (transaction.actionType === GRANT_TOKEN_SUCCESS || transaction.actionType === REVOKE_TOKEN_SUCCESS)
  )
)

export const getPendingTransactions = createSelector<RootState, Transaction[], Transaction[]>(getTransactions, transactions =>
  transactions.filter(transaction => isPending(transaction.status))
)
