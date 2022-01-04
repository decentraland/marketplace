import { AccountFilters as AccountMetricsFilters } from '@dcl/schemas'
import { Network } from 'decentraland-dapps/node_modules/@dcl/schemas'
import { action } from 'typesafe-actions'
import { AccountMetrics } from './types'

// Fetch account metrics

export const FETCH_ACCOUNT_METRICS_REQUEST = '[Request] Fetch accounts'
export const FETCH_ACCOUNT_METRICS_SUCCESS = '[Success] Fetch accounts'
export const FETCH_ACCOUNT_METRICS_FAILURE = '[Failure] Fetch accounts'

export const fetchAccountMetricsRequest = (filters: AccountMetricsFilters) =>
  action(FETCH_ACCOUNT_METRICS_REQUEST, { filters })
export const fetchAccountMetricsSuccess = (
  filters: AccountMetricsFilters,
  accountMetrics: Record<Network, AccountMetrics[]>
) => action(FETCH_ACCOUNT_METRICS_SUCCESS, { filters, accountMetrics })
export const fetchAccountMetricsFailure = (
  filters: AccountMetricsFilters,
  error: string
) => action(FETCH_ACCOUNT_METRICS_FAILURE, { filters, error })

export type FetchAccountMetricsRequestAction = ReturnType<
  typeof fetchAccountMetricsRequest
>
export type FetchAccountMetricsSuccessAction = ReturnType<
  typeof fetchAccountMetricsSuccess
>
export type FetchAccountMetricsFailureAction = ReturnType<
  typeof fetchAccountMetricsFailure
>
