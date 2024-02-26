import { action } from 'typesafe-actions'
import { ChainId } from '@dcl/schemas'
import { Route } from 'decentraland-transactions/crossChain'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'
import { ENS, ENSError } from './types'

// Claim a new name
export const CLAIM_NAME_REQUEST = '[Request] Claim Name'
export const CLAIM_NAME_SUCCESS = '[Success] Claim Name'
export const CLAIM_NAME_FAILURE = '[Failure] Claim Name'
export const CLAIM_NAME_TRANSACTION_SUBMITTED = '[Submitted] Claim Name'
export const CLAIM_NAME_CLEAR = '[Clear] Claim Name'

export const claimNameRequest = (name: string) =>
  action(CLAIM_NAME_REQUEST, { name })

export const claimNameTransactionSubmitted = (
  subdomain: string,
  address: string,
  chainId: ChainId,
  txHash: string,
  route?: Route
) =>
  action(CLAIM_NAME_TRANSACTION_SUBMITTED, {
    ...buildTransactionPayload(chainId, txHash, {
      subdomain,
      address,
      route
    })
  })

export const claimNameSuccess = (ens: ENS, name: string, txHash: string) =>
  action(CLAIM_NAME_SUCCESS, {
    ens,
    name,
    txHash
  })

export const claimNameFailure = (error: ENSError) =>
  action(CLAIM_NAME_FAILURE, { error })
export const claimNameClear = () => action(CLAIM_NAME_CLEAR)

export type ClaimNameRequestAction = ReturnType<typeof claimNameRequest>
export type ClaimNameSuccessAction = ReturnType<typeof claimNameSuccess>
export type ClaimNameFailureAction = ReturnType<typeof claimNameFailure>
export type ClaimNameTransactionSubmittedAction = ReturnType<
  typeof claimNameTransactionSubmitted
>
export type ClaimNameClearAction = ReturnType<typeof claimNameClear>

// Mint name cross chain
export const CLAIM_NAME_CROSS_CHAIN_REQUEST = '[Request] Claim name cross-chain'
export const CLAIM_NAME_CROSS_CHAIN_SUCCESS = '[Success] Claim name cross-chain'
export const CLAIM_NAME_CROSS_CHAIN_FAILURE = '[Failure] Claim name cross-chain'

export const claimNameCrossChainRequest = (
  name: string,
  chainId: ChainId,
  route: Route
) => action(CLAIM_NAME_CROSS_CHAIN_REQUEST, { name, chainId, route })

export const claimNameCrossChainSuccess = (
  ens: ENS,
  name: string,
  txHash: string,
  route: Route
) =>
  action(CLAIM_NAME_CROSS_CHAIN_SUCCESS, {
    ens,
    name,
    txHash,
    route
  })

export const claimNameCrossChainFailure = (
  route: Route,
  name: string,
  error: string
) => action(CLAIM_NAME_CROSS_CHAIN_FAILURE, { route, name, error })

export type ClaimNameCrossChainRequestAction = ReturnType<
  typeof claimNameCrossChainRequest
>
export type ClaimNameCrossChainSuccessAction = ReturnType<
  typeof claimNameCrossChainSuccess
>

export type ClaimNameCrossChainFailureAction = ReturnType<
  typeof claimNameCrossChainFailure
>
