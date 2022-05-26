import { action } from 'typesafe-actions'
import { Order } from '@dcl/schemas'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'
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

export const executeOrderRequest = (
  order: Order,
  nft: NFT,
  fingerprint?: string
) => action(EXECUTE_ORDER_REQUEST, { order, nft, fingerprint })
export const executeOrderSuccess = (order: Order, nft: NFT, txHash: string) =>
  action(EXECUTE_ORDER_SUCCESS, {
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
export const executeOrderFailure = (
  order: Order,
  nft: NFT,
  error: string,
  errorCode?: ErrorCode
) => action(EXECUTE_ORDER_FAILURE, { order, nft, error, errorCode })

export type ExecuteOrderRequestAction = ReturnType<typeof executeOrderRequest>
export type ExecuteOrderSuccessAction = ReturnType<typeof executeOrderSuccess>
export type ExecuteOrderFailureAction = ReturnType<typeof executeOrderFailure>

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
