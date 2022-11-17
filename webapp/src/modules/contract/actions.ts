import { Contract } from '../vendor/services'
import { action } from 'typesafe-actions'

// FETCH CONTRACTS

export const FETCH_CONTRACTS_REQUEST = '[Request] Fetch contracts'
export const FETCH_CONTRACTS_SUCCESS = '[Success] Fetch contracts'
export const FETCH_CONTRACTS_FAILURE = '[Failure] Fetch contracts'

export const fetchContractsRequest = () => action(FETCH_CONTRACTS_REQUEST)
export const fetchContractsSuccess = (contracts: Contract[]) =>
  action(FETCH_CONTRACTS_SUCCESS, {
    contracts
  })
export const fetchContractsFailure = (error: string) =>
  action(FETCH_CONTRACTS_FAILURE, { error })

export type FetchContractsRequestAction = ReturnType<
  typeof fetchContractsRequest
>
export type FetchContractsSuccessAction = ReturnType<
  typeof fetchContractsSuccess
>
export type FetchContractsFailureAction = ReturnType<
  typeof fetchContractsFailure
>
