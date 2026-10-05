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

export const FETCH_MORE_CANCELLED_TRADES_REQUEST = '[Request] Fetch more cancelled trades'
export const FETCH_MORE_CANCELLED_TRADES_SUCCESS = '[Success] Fetch more cancelled trades'
export const FETCH_MORE_CANCELLED_TRADES_FAILURE = '[Failure] Fetch more cancelled trades'

export const fetchMoreCancelledTradesRequest = (address: string, skip: number) =>
  action(FETCH_MORE_CANCELLED_TRADES_REQUEST, { address, skip })
export const fetchMoreCancelledTradesSuccess = (address: string, trades: CancelledTrade[], total: number) =>
  action(FETCH_MORE_CANCELLED_TRADES_SUCCESS, { address, trades, total })
export const fetchMoreCancelledTradesFailure = (address: string, error: string) =>
  action(FETCH_MORE_CANCELLED_TRADES_FAILURE, { address, error })

export type FetchMoreCancelledTradesRequestAction = ReturnType<typeof fetchMoreCancelledTradesRequest>
export type FetchMoreCancelledTradesSuccessAction = ReturnType<typeof fetchMoreCancelledTradesSuccess>
export type FetchMoreCancelledTradesFailureAction = ReturnType<typeof fetchMoreCancelledTradesFailure>
