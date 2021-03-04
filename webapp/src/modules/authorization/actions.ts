import { action } from 'typesafe-actions'
import { ChainId } from '@dcl/schemas'
import { buildTransactionPayload } from 'decentraland-dapps/dist//modules/transaction/utils'
import { Authorizations, AuthorizationsRequest, Address } from './types'

// Fetch authorization

export const FETCH_AUTHORIZATION_REQUEST = '[Request] Fetch Authorization'
export const FETCH_AUTHORIZATION_SUCCESS = '[Success] Fetch Authorization'
export const FETCH_AUTHORIZATION_FAILURE = '[Failure] Fetch Authorization'

export const fetchAuthorizationRequest = (
  address: string,
  { allowances, approvals }: AuthorizationsRequest
) => action(FETCH_AUTHORIZATION_REQUEST, { address, allowances, approvals })

export const fetchAuthorizationSuccess = (
  address: string,
  authorization: Authorizations
) => action(FETCH_AUTHORIZATION_SUCCESS, { address, authorization })

export const fetchAuthorizationFailure = (error: string) =>
  action(FETCH_AUTHORIZATION_FAILURE, { error })

export type FetchAuthorizationRequestAction = ReturnType<
  typeof fetchAuthorizationRequest
>
export type FetchAuthorizationSuccessAction = ReturnType<
  typeof fetchAuthorizationSuccess
>
export type FetchAuthorizationFailureAction = ReturnType<
  typeof fetchAuthorizationFailure
>

// Approve Token

export const ALLOW_TOKEN_REQUEST = '[Request] Allow Token'
export const ALLOW_TOKEN_SUCCESS = '[Success] Allow Token'
export const ALLOW_TOKEN_FAILURE = '[Failure] Allow Token'

export const allowTokenRequest = (
  isAllowed: boolean,
  contractAddress: Address,
  tokenContractAddress: Address
) =>
  action(ALLOW_TOKEN_REQUEST, {
    isAllowed,
    contractAddress,
    tokenContractAddress
  })

export const allowTokenSuccess = (
  chainId: ChainId,
  txHash: string,
  address: string,
  isAllowed: boolean,
  contractAddress: Address,
  tokenContractAddress: Address
) =>
  action(ALLOW_TOKEN_SUCCESS, {
    ...buildTransactionPayload(chainId, txHash, {
      address,
      isAllowed,
      contractAddress,
      tokenContractAddress
    }),
    address,
    isAllowed,
    contractAddress,
    tokenContractAddress
  })

export const allowTokenFailure = (error: string) =>
  action(ALLOW_TOKEN_FAILURE, { error })

export type AllowTokenRequestAction = ReturnType<typeof allowTokenRequest>
export type AllowTokenSuccessAction = ReturnType<typeof allowTokenSuccess>
export type AllowTokenFailureAction = ReturnType<typeof allowTokenFailure>

// Approve Token

export const APPROVE_TOKEN_REQUEST = '[Request] Approve Token'
export const APPROVE_TOKEN_SUCCESS = '[Success] Approve Token'
export const APPROVE_TOKEN_FAILURE = '[Failure] Approve Token'

export const approveTokenRequest = (
  isApproved: boolean,
  contractAddress: Address,
  tokenContractAddress: Address
) =>
  action(APPROVE_TOKEN_REQUEST, {
    isApproved,
    contractAddress,
    tokenContractAddress
  })

export const approveTokenSuccess = (
  chainId: ChainId,
  txHash: string,
  address: string,
  isApproved: boolean,
  contractAddress: Address,
  tokenContractAddress: Address
) =>
  action(APPROVE_TOKEN_SUCCESS, {
    ...buildTransactionPayload(chainId, txHash, {
      address,
      isApproved,
      contractAddress,
      tokenContractAddress
    }),
    address,
    isApproved,
    contractAddress,
    tokenContractAddress
  })

export const approveTokenFailure = (error: string) =>
  action(APPROVE_TOKEN_FAILURE, { error })

export type ApproveTokenRequestAction = ReturnType<typeof approveTokenRequest>
export type ApproveTokenSuccessAction = ReturnType<typeof approveTokenSuccess>
export type ApproveTokenFailureAction = ReturnType<typeof approveTokenFailure>
