import { getData } from 'decentraland-dapps/dist/modules/transaction/selectors'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { RootState } from '../reducer'
import { createSelector } from 'reselect'
import { getAddress } from '../wallet/selectors'

export * from 'decentraland-dapps/dist/modules/transaction/selectors'

export const getTransactionsByType = (
  state: RootState,
  address: string,
  type: string
): Transaction[] =>
  getData(state).filter(
    tx => tx.from.toLowerCase() === address && tx.actionType === type
  )

export const getTransactions = createSelector<
  RootState,
  Transaction[],
  string | undefined,
  Transaction[]
>(getData, getAddress, (transactions, address) =>
  transactions.filter(
    transaction =>
      !!address && transaction.from.toLowerCase() === address.toLowerCase()
  )
)
