import { GrantTokenRequestAction, RevokeTokenRequestAction } from 'decentraland-dapps/dist/modules/authorization/actions'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'

export function hasTransactionPending(transactions: Transaction[], authorizedAddress: string, contractAddress: string) {
  return transactions.some((transaction: Transaction) => {
    const { authorization } = transaction.payload as GrantTokenRequestAction['payload'] | RevokeTokenRequestAction['payload']
    return (
      authorization.authorizedAddress.toLowerCase() === authorizedAddress.toLowerCase() &&
      authorization.contractAddress.toLowerCase() === contractAddress.toLowerCase()
    )
  })
}

// TODO: This is a replacement for future `ErrorCode`s. Needs an overhaul on decentraland-dapps
export function isUserCanceled(error: string) {
  return error.search(/User canceled/) !== -1
}

export function isUserDeniedSignatureError(error: string) {
  return error.search(/User (denied|rejected) (transaction|message)( signature)?/) !== -1
}

export function isUserRejectedTransactionError(error: string) {
  return error.search(/user rejected transaction/) !== -1
}

// TODO: This is a replacement for future `ErrorCode`s. Needs an overhaul on decentraland-dapps
export function isContractAccountError(error: string) {
  return error.search('Contract accounts are not supported') !== -1
}
