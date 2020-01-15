import { action } from 'typesafe-actions'

import { Order, OrderCategory } from './types'
import { View } from '../ui/types'
import { NFT } from '../nft/types'

// Fetch Orders

export const FETCH_ORDERS_REQUEST = '[Request] Fetch Orders'
export const FETCH_ORDERS_SUCCESS = '[Success] Fetch Orders'
export const FETCH_ORDERS_FAILURE = '[Failure] Fetch Orders'

export type FetchOrderOptions = {
  variables: {
    first: number
    skip: number
    orderBy?: keyof Order
    orderDirection: 'asc' | 'desc'
    category?: OrderCategory
  }
  view?: View
}

export const DEFAULT_FETCH_ORDER_OPTIONS: FetchOrderOptions = {
  variables: {
    first: 24,
    skip: 0,
    orderBy: 'createdAt',
    orderDirection: 'desc',
    category: undefined
  },
  view: undefined
}

export const fetchOrdersRequest = (options: Partial<FetchOrderOptions> = {}) =>
  action(FETCH_ORDERS_REQUEST, { options })
export const fetchOrdersSuccess = (
  options: FetchOrderOptions,
  orders: Order[],
  nfts: NFT[]
) => action(FETCH_ORDERS_SUCCESS, { options, orders, nfts })
export const fetchOrdersFailure = (options: FetchOrderOptions, error: string) =>
  action(FETCH_ORDERS_FAILURE, { options, error })

export type FetchOrdersRequestAction = ReturnType<typeof fetchOrdersRequest>
export type FetchOrdersSuccessAction = ReturnType<typeof fetchOrdersSuccess>
export type FetchOrdersFailureAction = ReturnType<typeof fetchOrdersFailure>

// Create Order (aka Sell)

export const CREATE_ORDER_REQUEST = '[Request] Create Order'
export const CREATE_ORDER_SUCCESS = '[Success] Create Order'
export const CREATE_ORDER_FAILURE = '[Failure] Create Order'

export const createOrderRequest = (nft: NFT) =>
  action(CREATE_ORDER_REQUEST, { nft })
export const createOrderSuccess = (nft: NFT, order: Order) =>
  action(CREATE_ORDER_SUCCESS, { nft, order })
export const createOrderFailure = (nft: NFT, error: string) =>
  action(CREATE_ORDER_FAILURE, { nft, error })

export type CreateOrderRequestAction = ReturnType<typeof createOrderRequest>
export type CreateOrderSuccessAction = ReturnType<typeof createOrderSuccess>
export type CreateOrderFailureAction = ReturnType<typeof createOrderFailure>

// Execute Order (aka Buy)

export const EXECUTE_ORDER_REQUEST = '[Request] Execute Order'
export const EXECUTE_ORDER_SUCCESS = '[Success] Execute Order'
export const EXECUTE_ORDER_FAILURE = '[Failure] Execute Order'

export const executeOrderRequest = (order: Order) =>
  action(EXECUTE_ORDER_REQUEST, { order })
export const executeOrderSuccess = (order: Order, nft: NFT) =>
  action(EXECUTE_ORDER_SUCCESS, { order, nft })
export const executeOrderFailure = (order: Order, error: string) =>
  action(EXECUTE_ORDER_FAILURE, { order, error })
