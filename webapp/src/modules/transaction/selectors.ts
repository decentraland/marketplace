import { getData } from 'decentraland-dapps/dist/modules/transaction/selectors'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { RootState } from '../reducer'

export * from 'decentraland-dapps/dist/modules/transaction/selectors'

export const getTransactionsByType = (
  state: RootState,
  address: string,
  type: string
): Transaction[] =>
  getData(state).filter(
    tx => tx.from.toLowerCase() === address && tx.actionType === type
  )
