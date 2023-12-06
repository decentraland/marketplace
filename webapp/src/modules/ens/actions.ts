import { action } from 'typesafe-actions'
import { ChainId } from '@dcl/schemas'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'
import { Authorization, ENS, ENSError } from './types'

// Get a ENS List (list of names) owned by the current account
export const FETCH_ENS_LIST_REQUEST = '[Request] Fetch ENS List'
export const FETCH_ENS_LIST_SUCCESS = '[Success] Fetch ENS List'
export const FETCH_ENS_LIST_FAILURE = '[Failure] Fetch ENS List'

export const fetchENSListRequest = () => action(FETCH_ENS_LIST_REQUEST, {})
export const fetchENSListSuccess = (ensList: ENS[]) =>
  action(FETCH_ENS_LIST_SUCCESS, { ensList })
export const fetchENSListFailure = (error: ENSError) =>
  action(FETCH_ENS_LIST_FAILURE, { error })

export type FetchENSListRequestAction = ReturnType<typeof fetchENSListRequest>
export type FetchENSListSuccessAction = ReturnType<typeof fetchENSListSuccess>
export type FetchENSListFailureAction = ReturnType<typeof fetchENSListFailure>

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
  txHash: string
) =>
  action(CLAIM_NAME_TRANSACTION_SUBMITTED, {
    ...buildTransactionPayload(chainId, txHash, { subdomain, address })
  })
export const claimNameSuccess = (ens: ENS, name: string) =>
  action(CLAIM_NAME_SUCCESS, {
    ens,
    name
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

// Fetch ENS related authorizations
export const FETCH_ENS_AUTHORIZATION_REQUEST =
  '[Request] Fetch ENS Authorization'
export const FETCH_ENS_AUTHORIZATION_SUCCESS =
  '[Success] Fetch ENS Authorization'
export const FETCH_ENS_AUTHORIZATION_FAILURE =
  '[Failure] Fetch ENS Authorization'

export const fetchENSAuthorizationRequest = () =>
  action(FETCH_ENS_AUTHORIZATION_REQUEST, {})
export const fetchENSAuthorizationSuccess = (
  authorization: Authorization,
  address: string
) => action(FETCH_ENS_AUTHORIZATION_SUCCESS, { authorization, address })
export const fetchENSAuthorizationFailure = (error: ENSError) =>
  action(FETCH_ENS_AUTHORIZATION_FAILURE, { error })

export type FetchENSAuthorizationRequestAction = ReturnType<
  typeof fetchENSAuthorizationRequest
>
export type FetchENSAuthorizationSuccessAction = ReturnType<
  typeof fetchENSAuthorizationSuccess
>
export type FetchENSAuthorizationFailureAction = ReturnType<
  typeof fetchENSAuthorizationFailure
>

// Reclaim ENS name
export const RECLAIM_NAME_REQUEST = '[Request] Reclaim Name'
export const RECLAIM_NAME_SUCCESS = '[Success] Reclaim Name'
export const RECLAIM_NAME_FAILURE = '[Failure] Reclaim Name'

export const reclaimNameRequest = (ens: ENS) =>
  action(RECLAIM_NAME_REQUEST, { ens })
export const reclaimNameSuccess = (txHash: string, chainId: number, ens: ENS) =>
  action(RECLAIM_NAME_SUCCESS, {
    ...buildTransactionPayload(chainId, txHash, { ens }),
    ens
  })
export const reclaimNameFailure = (error: ENSError) =>
  action(RECLAIM_NAME_FAILURE, { error })

export type ReclaimNameRequestAction = ReturnType<typeof reclaimNameRequest>
export type ReclaimNameSuccessAction = ReturnType<typeof reclaimNameSuccess>
export type ReclaimNameFailureAction = ReturnType<typeof reclaimNameFailure>

// Allow MANA to claim names
export const ALLOW_CLAIM_MANA_REQUEST = '[Request] Allow Claim MANA'
export const ALLOW_CLAIM_MANA_SUCCESS = '[Success] Allow Claim MANA'
export const ALLOW_CLAIM_MANA_FAILURE = '[Failure] Allow Claim MANA'

export const allowClaimManaRequest = (allowance: string) =>
  action(ALLOW_CLAIM_MANA_REQUEST, { allowance })
export const allowClaimManaSuccess = (
  allowance: string,
  address: string,
  chainId: ChainId,
  txHash: string
) =>
  action(ALLOW_CLAIM_MANA_SUCCESS, {
    ...buildTransactionPayload(chainId, txHash, { allowance, address }),
    allowance,
    address
  })
export const allowClaimManaFailure = (error: ENSError) =>
  action(ALLOW_CLAIM_MANA_FAILURE, { error })

export type AllowClaimManaRequestAction = ReturnType<
  typeof allowClaimManaRequest
>
export type AllowClaimManaSuccessAction = ReturnType<
  typeof allowClaimManaSuccess
>
export type AllowClaimManaFailureAction = ReturnType<
  typeof allowClaimManaFailure
>
