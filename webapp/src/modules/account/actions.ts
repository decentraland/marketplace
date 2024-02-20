import { AccountFilters as AccountMetricsFilters } from '@dcl/schemas'
import { Network } from '@dcl/schemas'
import { action } from 'typesafe-actions'
import { AccountMetrics, CreatorAccount } from './types'

// Fetch account metrics

export const FETCH_ACCOUNT_METRICS_REQUEST = '[Request] Fetch accounts'
export const FETCH_ACCOUNT_METRICS_SUCCESS = '[Success] Fetch accounts'
export const FETCH_ACCOUNT_METRICS_FAILURE = '[Failure] Fetch accounts'

export const fetchAccountMetricsRequest = (filters: AccountMetricsFilters) =>
  action(FETCH_ACCOUNT_METRICS_REQUEST, { filters })
export const fetchAccountMetricsSuccess = (
  filters: AccountMetricsFilters,
  accountMetrics: {
    [Network.ETHEREUM]: AccountMetrics[]
    [Network.MATIC]: AccountMetrics[]
  }
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

// Fetch creators accounts

export const FETCH_CREATORS_ACCOUNT_REQUEST =
  '[Request] Fetch creators accounts'
export const FETCH_CREATORS_ACCOUNT_SUCCESS =
  '[Success] Fetch creators accounts'
export const FETCH_CREATORS_ACCOUNT_FAILURE =
  '[Failure] Fetch creators accounts'

export const fetchCreatorsAccountRequest = (
  search: string,
  searchUUID?: string
) => action(FETCH_CREATORS_ACCOUNT_REQUEST, { search, searchUUID })
export const fetchCreatorsAccountSuccess = (
  search: string,
  creatorAccounts: CreatorAccount[],
  searchUUID?: string
) =>
  action(FETCH_CREATORS_ACCOUNT_SUCCESS, {
    search,
    creatorAccounts,
    searchUUID
  })
export const fetchCreatorsAccountFailure = (search: string, error: string) =>
  action(FETCH_CREATORS_ACCOUNT_FAILURE, { search, error })

export type FetchCreatorsAccountRequestAction = ReturnType<
  typeof fetchCreatorsAccountRequest
>
export type FetchCreatorsAccountSuccessAction = ReturnType<
  typeof fetchCreatorsAccountSuccess
>
export type FetchCreatorsAccountFailureAction = ReturnType<
  typeof fetchCreatorsAccountFailure
>
