import { action } from 'typesafe-actions'

import { Account } from './types'

// Fetch Account

export const FETCH_ACCOUNT_REQUEST = '[Request] Fetch Account'
export const FETCH_ACCOUNT_SUCCESS = '[Success] Fetch Account'
export const FETCH_ACCOUNT_FAILURE = '[Failure] Fetch Account'

export const fetchAccountRequest = (address: string) =>
  action(FETCH_ACCOUNT_REQUEST, { address })
export const fetchAccountSuccess = (address: string, account: Account) =>
  action(FETCH_ACCOUNT_SUCCESS, { address, account })
export const fetchAccountFailure = (address: string, error: string) =>
  action(FETCH_ACCOUNT_FAILURE, { address, error })

export type FetchAccountRequestAction = ReturnType<typeof fetchAccountRequest>
export type FetchAccountSuccessAction = ReturnType<typeof fetchAccountSuccess>
export type FetchAccountFailureAction = ReturnType<typeof fetchAccountFailure>
