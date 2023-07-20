import { action } from 'typesafe-actions'
import { Order } from '@dcl/schemas'
import {
  buildTransactionPayload,
  buildTransactionWithFromPayload,
  buildTransactionWithReceiptPayload
} from 'decentraland-dapps/dist/modules/transaction/utils'
import { NFTPurchase } from 'decentraland-dapps/dist/modules/gateway/types'
import { ErrorCode } from 'decentraland-transactions'
import { NFT } from '../nft/types'
import { getAssetName } from '../asset/utils'
import { formatWeiMANA } from '../../lib/mana'

// Create Order (aka Sell)

export const CREATE_ORDER_REQUEST = '[Request] Create Order'
export const CREATE_ORDER_SUCCESS = '[Success] Create Order'
export const CREATE_ORDER_FAILURE = '[Failure] Create Order'

export const createOrderRequest = (
  nft: NFT,
  price: number,
  expiresAt: number
) => action(CREATE_ORDER_REQUEST, { nft, price, expiresAt })
export const createOrderSuccess = (
  nft: NFT,
  price: number,
  expiresAt: number,
  txHash: string
) =>
  action(CREATE_ORDER_SUCCESS, {
    nft,
    price,
    expiresAt,
    ...buildTransactionPayload(nft.chainId, txHash, {
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      network: nft.network,
      name: getAssetName(nft),
      price
    })
  })
export const createOrderFailure = (
  nft: NFT,
  price: number,
  expiresAt: number,
  error: string,
  errorCode?: ErrorCode
) => action(CREATE_ORDER_FAILURE, { nft, price, expiresAt, error, errorCode })

export type CreateOrderRequestAction = ReturnType<typeof createOrderRequest>
export type CreateOrderSuccessAction = ReturnType<typeof createOrderSuccess>
export type CreateOrderFailureAction = ReturnType<typeof createOrderFailure>

// Execute Order (aka Buy)

export const EXECUTE_ORDER_REQUEST = '[Request] Execute Order'
export const EXECUTE_ORDER_SUCCESS = '[Success] Execute Order'
export const EXECUTE_ORDER_FAILURE = '[Failure] Execute Order'
export const EXECUTE_ORDER_TRANSACTION_SUBMITTED =
  '[Submitted transaction] Execute Order'

export const executeOrderRequest = (
  order: Order,
  nft: NFT,
  fingerprint?: string,
  silent?: boolean
) => action(EXECUTE_ORDER_REQUEST, { order, nft, fingerprint, silent })
export const executeOrderTransactionSubmitted = (
  order: Order,
  nft: NFT,
  txHash: string
) =>
  action(EXECUTE_ORDER_TRANSACTION_SUBMITTED, {
    order,
    nft,
    ...buildTransactionWithReceiptPayload(nft.chainId, txHash, {
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      network: nft.network,
      name: getAssetName(nft),
      price: formatWeiMANA(order.price)
    })
  })
export const executeOrderSuccess = (txHash: string, nft: NFT) =>
  action(EXECUTE_ORDER_SUCCESS, { txHash, nft })
export const executeOrderFailure = (
  order: Order,
  nft: NFT,
  error: string,
  errorCode?: ErrorCode,
  silent?: boolean
) => action(EXECUTE_ORDER_FAILURE, { order, nft, error, errorCode, silent })

export type ExecuteOrderRequestAction = ReturnType<typeof executeOrderRequest>
export type ExecuteOrderSuccessAction = ReturnType<typeof executeOrderSuccess>
export type ExecuteOrderTransactionSubmittedAction = ReturnType<
  typeof executeOrderTransactionSubmitted
>
export type ExecuteOrderFailureAction = ReturnType<typeof executeOrderFailure>

// Execute Order With Card (aka Buy with Card)
export const EXECUTE_ORDER_WITH_CARD_REQUEST =
  '[Request] Execute Order With Card'
export const EXECUTE_ORDER_WITH_CARD_SUCCESS =
  '[Success] Execute Order With Card'
export const EXECUTE_ORDER_WITH_CARD_FAILURE =
  '[Failure] Execute Order With Card'

export const executeOrderWithCardRequest = (nft: NFT) =>
  action(EXECUTE_ORDER_WITH_CARD_REQUEST, { nft })

export const executeOrderWithCardSuccess = (
  purchase: NFTPurchase,
  nft: NFT,
  txHash: string
) =>
  action(EXECUTE_ORDER_WITH_CARD_SUCCESS, {
    purchase,
    nft,
    ...buildTransactionWithFromPayload(nft.chainId, txHash, purchase.address, {
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      network: nft.network,
      name: getAssetName(nft),
      price: purchase.nft.cryptoAmount.toString()
    })
  })
export const executeOrderWithCardFailure = (error: string) =>
  action(EXECUTE_ORDER_WITH_CARD_FAILURE, { error })

export type ExecuteOrderWithCardRequestAction = ReturnType<
  typeof executeOrderWithCardRequest
>
export type ExecuteOrderWithCardSuccessAction = ReturnType<
  typeof executeOrderWithCardSuccess
>
export type ExecuteOrderWithCardFailureAction = ReturnType<
  typeof executeOrderWithCardFailure
>

// Cancel Order (aka Cancel Sale)

export const CANCEL_ORDER_REQUEST = '[Request] Cancel Order'
export const CANCEL_ORDER_SUCCESS = '[Success] Cancel Order'
export const CANCEL_ORDER_FAILURE = '[Failure] Cancel Order'

export const cancelOrderRequest = (order: Order, nft: NFT) =>
  action(CANCEL_ORDER_REQUEST, { order, nft })
export const cancelOrderSuccess = (order: Order, nft: NFT, txHash: string) =>
  action(CANCEL_ORDER_SUCCESS, {
    order,
    nft,
    ...buildTransactionPayload(nft.chainId, txHash, {
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      network: nft.network,
      name: getAssetName(nft),
      price: formatWeiMANA(order.price)
    })
  })
export const cancelOrderFailure = (
  order: Order,
  nft: NFT,
  error: string,
  errorCode?: ErrorCode
) => action(CANCEL_ORDER_FAILURE, { order, nft, error, errorCode })

export type CancelOrderRequestAction = ReturnType<typeof cancelOrderRequest>
export type CancelOrderSuccessAction = ReturnType<typeof cancelOrderSuccess>
export type CancelOrderFailureAction = ReturnType<typeof cancelOrderFailure>

export const CLEAR_ORDER_ERRORS = 'Clear Order Errors'

export const clearOrderErrors = () => action(CLEAR_ORDER_ERRORS)

export type ClearOrderErrorsAction = ReturnType<typeof clearOrderErrors>
