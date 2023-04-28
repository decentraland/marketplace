import { Dispatch } from 'redux'
import { BigNumber } from 'ethers'
import {
  fetchAuthorizationsRequest,
  FetchAuthorizationsRequestAction,
  grantTokenRequest,
  GrantTokenRequestAction,
  revokeTokenRequest,
  RevokeTokenRequestAction
} from 'decentraland-dapps/dist/modules/authorization/actions'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { Network } from '@dcl/schemas'
import { Contract } from '../../../../modules/vendor/services'
import { RootState } from '../../../../modules/reducer'

// Action to perfom after authorization step is finished
export enum AuthorizedAction {
  BID = 'bid',
  BUY = 'buy',
  MINT = 'mint',
  RENT = 'rent',
  CLAIM_NAME = 'claim_name',
  SWAP_MANA = 'swap_mana',
  SELL = 'sell'
}

export enum AuthorizationStepStatus {
  LOADING_INFO = 'loading_info',
  PENDING = 'pending',
  WAITING = 'waiting',
  PROCESSING = 'processing',
  ERROR = 'error',
  DONE = 'done'
}

export type Props = {
  authorization: Authorization
  requiredAllowance?: BigNumber
  currentAllowance?: BigNumber
  action: AuthorizedAction
  authorizationType: AuthorizationType
  revokeStatus: AuthorizationStepStatus
  grantStatus: AuthorizationStepStatus
  confirmationStatus: AuthorizationStepStatus
  error: string
  confirmationError: string | null
  network: Network
  getConfirmationStatus?: (state: RootState) => AuthorizationStepStatus
  getConfirmationError?: (state: RootState) => string | null
  getContract: (query: Partial<Contract>) => Contract | null
  onClose: () => void
  onAuthorized: () => void
  onRevoke: typeof revokeTokenRequest
  onGrant: typeof grantTokenRequest
  onFetchAuthorizations: typeof fetchAuthorizationsRequest
}

export type MapDispatchProps = Pick<
  Props,
  'onRevoke' | 'onGrant' | 'onFetchAuthorizations'
>
export type MapDispatch = Dispatch<
  | RevokeTokenRequestAction
  | GrantTokenRequestAction
  | FetchAuthorizationsRequestAction
>
export type OwnProps = Pick<
  Props,
  | 'authorization'
  | 'requiredAllowance'
  | 'getConfirmationStatus'
  | 'getConfirmationError'
>
export type MapStateProps = Pick<
  Props,
  | 'revokeStatus'
  | 'grantStatus'
  | 'error'
  | 'getContract'
  | 'confirmationStatus'
  | 'confirmationError'
>
