import { action } from 'typesafe-actions'

import { Order, OrderCategory } from './types'
import { View } from '../ui/types'

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
  orders: Order[]
) => action(FETCH_ORDERS_SUCCESS, { options, orders })
export const fetchOrdersFailure = (options: FetchOrderOptions, error: string) =>
  action(FETCH_ORDERS_FAILURE, { options, error })

export type FetchOrdersRequestAction = ReturnType<typeof fetchOrdersRequest>
export type FetchOrdersSuccessAction = ReturnType<typeof fetchOrdersSuccess>
export type FetchOrdersFailureAction = ReturnType<typeof fetchOrdersFailure>
