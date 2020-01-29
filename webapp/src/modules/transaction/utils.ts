import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'

export function hasTransactionPending(
  transactions: Transaction[],
  contractAddress: string,
  tokenContractAddress: string
) {
  return transactions.some(
    (transaction: any) =>
      transaction.payload.contractAddress === contractAddress &&
      transaction.payload.tokenContractAddress === tokenContractAddress
  )
}
