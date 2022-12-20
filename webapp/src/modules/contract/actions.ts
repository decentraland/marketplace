import { Contract } from '../vendor/services'
import { action } from 'typesafe-actions'

// FETCH CONTRACTS

export const FETCH_CONTRACTS_REQUEST = '[Request] Fetch contracts'
export const FETCH_CONTRACTS_SUCCESS = '[Success] Fetch contracts'
export const FETCH_CONTRACTS_FAILURE = '[Failure] Fetch contracts'

/**
 * Creates the action for fetching contracts.
 * @param includeMaticCollections Determines if the saga should fetch contracts from the nft server.
 * If not, it will just use the contracts defined in src/modules/vendor/decentraland/contracts.ts.
 * @param shouldFetchAuthorizations Determines if the saga should fetch the authorizations for the newly stored contracts.
 */
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

// ADD CONTRACTS

export const ADD_CONTRACTS = 'Add contracts'

/**
 * Create the action for adding contracts to the store.
 * @param contracts Contracts to be appended to the stored contracts.
 * @param shouldFetchAuthorizations Determines if the saga has to fetch the authorizations for the stored contracts.
 */
export const addContracts = (
  contracts: Contract[],
  shouldFetchAuthorizations: boolean
) => action(ADD_CONTRACTS, { contracts, shouldFetchAuthorizations })

export type AddContractsAction = ReturnType<typeof addContracts>
