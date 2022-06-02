import { action } from 'typesafe-actions'
import { AuthIdentity } from '@dcl/crypto'

// Generate identity

export const GENERATE_IDENTITY_REQUEST = '[Request] Generate Identity'
export const GENERATE_IDENTITY_SUCCESS = '[Success] Generate Identity'
export const GENERATE_IDENTITY_FAILURE = '[Failure] Generate Identity'

export const generateIdentityRequest = (address: string) =>
  action(GENERATE_IDENTITY_REQUEST, { address })
export const generateIdentitySuccess = (
  address: string,
  identity: AuthIdentity
) => action(GENERATE_IDENTITY_SUCCESS, { address, identity })
export const generateIdentityFailure = (address: string, error: string) =>
  action(GENERATE_IDENTITY_FAILURE, { address, error })

export type GenerateIdentityRequestAction = ReturnType<
  typeof generateIdentityRequest
>
export type GenerateIdentitySuccessAction = ReturnType<
  typeof generateIdentitySuccess
>
export type GenerateIdentityFailureAction = ReturnType<
  typeof generateIdentityFailure
>
