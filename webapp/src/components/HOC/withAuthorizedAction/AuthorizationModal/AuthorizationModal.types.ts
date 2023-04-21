import { Dispatch } from 'redux'
import {
  grantTokenRequest,
  GrantTokenRequestAction,
  revokeTokenRequest,
  RevokeTokenRequestAction
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { Authorization, AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'

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
  PENDING = 'pending',
  WAITING = 'waiting',
  PROCESSING = 'processing',
  ERROR = 'error',
  DONE = 'done'
}

export type Props = {
  authorization: Authorization
  requiredAllowance: string
  action: AuthorizedAction
  authorizationType: AuthorizationType
  revokeStatus: AuthorizationStepStatus
  grantStatus: AuthorizationStepStatus
  error: string
  onClose: () => void
  onAuthorized: () => void
  onRevoke: typeof revokeTokenRequest
  onGrant: typeof grantTokenRequest
}

export type MapDispatchProps = Pick<Props, 'onRevoke' | 'onGrant'>
export type MapDispatch = Dispatch<RevokeTokenRequestAction | GrantTokenRequestAction>
export type OwnProps = Pick<Props, 'authorization' | 'requiredAllowance'>
export type MapStateProps = Pick<Props, 'revokeStatus' | 'grantStatus' | 'error'>
