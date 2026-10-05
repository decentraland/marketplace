import { action } from 'typesafe-actions'
import { CancelledTrade } from '../vendor/decentraland/cancelledTrades/types'

export const FETCH_CANCELLED_TRADES_REQUEST = '[Request] Fetch cancelled trades'
export const FETCH_CANCELLED_TRADES_SUCCESS = '[Success] Fetch cancelled trades'
export const FETCH_CANCELLED_TRADES_FAILURE = '[Failure] Fetch cancelled trades'

export const fetchCancelledTradesRequest = (address: string) => action(FETCH_CANCELLED_TRADES_REQUEST, { address })
export const fetchCancelledTradesSuccess = (address: string, trades: CancelledTrade[], total: number) =>
  action(FETCH_CANCELLED_TRADES_SUCCESS, { address, trades, total })
export const fetchCancelledTradesFailure = (address: string, error: string) => action(FETCH_CANCELLED_TRADES_FAILURE, { address, error })

export type FetchCancelledTradesRequestAction = ReturnType<typeof fetchCancelledTradesRequest>
export type FetchCancelledTradesSuccessAction = ReturnType<typeof fetchCancelledTradesSuccess>
export type FetchCancelledTradesFailureAction = ReturnType<typeof fetchCancelledTradesFailure>
