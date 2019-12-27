import { action } from 'typesafe-actions'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'

// Send MANA

export const SEND_MANA_REQUEST = '[Request] Send MANA'
export const SEND_MANA_SUCCESS = '[Success] Send MANA'
export const SEND_MANA_FAILURE = '[Failure] Send MANA'

export const sendMANARequest = (address: string, amount: number) =>
  action(SEND_MANA_REQUEST, {
    address,
    amount
  })

export const sendMANASuccess = (
  address: string,
  amount: number,
  txHash: string
) =>
  action(SEND_MANA_SUCCESS, {
    ...buildTransactionPayload(txHash, {
      address,
      amount
    }),
    address,
    amount
  })

export const sendMANAFailure = (
  address: string,
  amount: number,
  errorMessage: string
) =>
  action(SEND_MANA_FAILURE, {
    address,
    amount,
    errorMessage
  })

export type SendMANARequestAction = ReturnType<typeof sendMANARequest>
export type SendMANASuccessAction = ReturnType<typeof sendMANASuccess>
export type SendMANAFailureAction = ReturnType<typeof sendMANAFailure>
