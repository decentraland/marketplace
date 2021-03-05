import { action } from 'typesafe-actions'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'

import { NFT } from '../nft/types'
import { Order } from './types'
import { getNFTName } from '../nft/utils'
import { formatMANA } from '../../lib/mana'
import { ChainId } from '@dcl/schemas'

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
  chainId: ChainId,
  txHash: string
) =>
  action(CREATE_ORDER_SUCCESS, {
    nft,
    price,
    expiresAt,
    ...buildTransactionPayload(chainId, txHash, {
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      name: getNFTName(nft),
      price
    })
  })
export const createOrderFailure = (
  nft: NFT,
  price: number,
  expiresAt: number,
  error: string
) => action(CREATE_ORDER_FAILURE, { nft, price, expiresAt, error })

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
export const executeOrderSuccess = (
  order: Order,
  nft: NFT,
  chainId: ChainId,
  txHash: string
) =>
  action(EXECUTE_ORDER_SUCCESS, {
    order,
    nft,
    ...buildTransactionPayload(chainId, txHash, {
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      name: getNFTName(nft),
      price: formatMANA(order.price)
    })
  })
export const executeOrderFailure = (order: Order, nft: NFT, error: string) =>
  action(EXECUTE_ORDER_FAILURE, { order, nft, error })

export type ExecuteOrderRequestAction = ReturnType<typeof executeOrderRequest>
export type ExecuteOrderSuccessAction = ReturnType<typeof executeOrderSuccess>
export type ExecuteOrderFailureAction = ReturnType<typeof executeOrderFailure>

// Cancel Order (aka Cancel Sale)

export const CANCEL_ORDER_REQUEST = '[Request] Cancel Order'
export const CANCEL_ORDER_SUCCESS = '[Success] Cancel Order'
export const CANCEL_ORDER_FAILURE = '[Failure] Cancel Order'

export const cancelOrderRequest = (order: Order, nft: NFT) =>
  action(CANCEL_ORDER_REQUEST, { order, nft })
export const cancelOrderSuccess = (
  order: Order,
  nft: NFT,
  chainId: ChainId,
  txHash: string
) =>
  action(CANCEL_ORDER_SUCCESS, {
    order,
    nft,
    ...buildTransactionPayload(chainId, txHash, {
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      name: getNFTName(nft),
      price: formatMANA(order.price)
    })
  })
export const cancelOrderFailure = (order: Order, nft: NFT, error: string) =>
  action(CANCEL_ORDER_FAILURE, { order, nft, error })

export type CancelOrderRequestAction = ReturnType<typeof cancelOrderRequest>
export type CancelOrderSuccessAction = ReturnType<typeof cancelOrderSuccess>
export type CancelOrderFailureAction = ReturnType<typeof cancelOrderFailure>
