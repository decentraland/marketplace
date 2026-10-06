import { action } from 'typesafe-actions'
import { CancelledTrade } from '../vendor/decentraland/cancelledTrades/types'

export const FETCH_CANCELLED_TRADES_REQUEST = '[Request] Fetch cancelled trades'
export const FETCH_CANCELLED_TRADES_SUCCESS = '[Success] Fetch cancelled trades'
export const FETCH_CANCELLED_TRADES_FAILURE = '[Failure] Fetch cancelled trades'

export const fetchCancelledTradesRequest = (skip = 0) => action(FETCH_CANCELLED_TRADES_REQUEST, { skip })
export const fetchCancelledTradesSuccess = (trades: CancelledTrade[], total: number, skip: number) =>
  action(FETCH_CANCELLED_TRADES_SUCCESS, { trades, total, skip })
export const fetchCancelledTradesFailure = (error: string) => action(FETCH_CANCELLED_TRADES_FAILURE, { error })

export type FetchCancelledTradesRequestAction = ReturnType<typeof fetchCancelledTradesRequest>
export type FetchCancelledTradesSuccessAction = ReturnType<typeof fetchCancelledTradesSuccess>
export type FetchCancelledTradesFailureAction = ReturnType<typeof fetchCancelledTradesFailure>
