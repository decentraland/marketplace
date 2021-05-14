import {
  GrantTokenRequestAction,
  RevokeTokenRequestAction
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'

export function hasTransactionPending(
  transactions: Transaction[],
  authorizedAddress: string,
  tokenAddress: string
) {
  return transactions.some((transaction: any) => {
    const { authorization } = transaction.payload as
      | GrantTokenRequestAction['payload']
      | RevokeTokenRequestAction['payload']
    return (
      authorization.authorizedAddress.toLowerCase() ===
        authorizedAddress.toLowerCase() &&
      authorization.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
    )
  })
}
