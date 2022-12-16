import { Contract } from '../vendor/services'
import { action } from 'typesafe-actions'

// FETCH CONTRACTS

export const FETCH_CONTRACTS_REQUEST = '[Request] Fetch contracts'
export const FETCH_CONTRACTS_SUCCESS = '[Success] Fetch contracts'
export const FETCH_CONTRACTS_FAILURE = '[Failure] Fetch contracts'

export const fetchContractsRequest = (
  includeMaticCollections: boolean,
  shouldFetchAuthorizations: boolean
) =>
  action(FETCH_CONTRACTS_REQUEST, {
    includeMaticCollections,
    shouldFetchAuthorizations
  })
export const fetchContractsSuccess = (
  includeMaticCollections: boolean,
  shouldFetchAuthorizations: boolean,
  contracts: Contract[]
) =>
  action(FETCH_CONTRACTS_SUCCESS, {
    includeMaticCollections,
    shouldFetchAuthorizations,
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
