import { action } from 'typesafe-actions'

import { Order, OrderCategory } from './types'
import { View } from '../ui/types'

// Fetch Orders

export const FETCH_ORDERS_REQUEST = '[Request] Fetch Orders'
export const FETCH_ORDERS_SUCCESS = '[Success] Fetch Orders'
export const FETCH_ORDERS_FAILURE = '[Failure] Fetch Orders'

export type FetchOrderOptions = {
  first: number
  skip: number
  category: OrderCategory | null
  orderBy: keyof Order | null
  orderDirection: 'asc' | 'desc'
  view: View | null
}

export const DEFAULT_FETCH_ORDER_OPTIONS: FetchOrderOptions = {
  first: 24,
  skip: 0,
  category: null,
  orderBy: 'createdAt',
  orderDirection: 'desc',
  view: null
}

export const fetchOrdersRequest = (options: Partial<FetchOrderOptions> = {}) =>
  action(FETCH_ORDERS_REQUEST, { options })
export const fetchOrdersSuccess = (
  options: FetchOrderOptions,
  orders: Order[]
) => action(FETCH_ORDERS_SUCCESS, { options, orders })
export const fetchOrdersFailure = (options: FetchOrderOptions, error: string) =>
  action(FETCH_ORDERS_FAILURE, { options, error })

export type FetchOrdersRequestAction = ReturnType<typeof fetchOrdersRequest>
export type FetchOrdersSuccessAction = ReturnType<typeof fetchOrdersSuccess>
export type FetchOrdersFailureAction = ReturnType<typeof fetchOrdersFailure>
