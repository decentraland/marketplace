import { Dispatch } from 'redux'
import { BigNumber } from 'ethers'
import {
  authorizationFlowRequest,
  AuthorizationFlowRequestAction,
  fetchAuthorizationsRequest,
  FetchAuthorizationsRequestAction,
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
  ALLOWANCE_AMOUNT_ERROR = 'allowance_amount_error',
  ERROR = 'error',
  DONE = 'done'
}

export enum AuthorizationStepAction {
  REVOKE = 'revoke',
  GRANT = 'grant',
  CONFIRM = 'confirm'
}
export type Props = {
  authorization: Authorization
  requiredAllowance?: BigNumber
  currentAllowance?: BigNumber
  action: AuthorizedAction
  authorizationType: AuthorizationType
  confirmationStatus: AuthorizationStepStatus
  grantStatus: AuthorizationStepStatus
  revokeStatus: AuthorizationStepStatus
  error: string
  confirmationError: string | null
  network: Network
  contracts: Contract[]
  getConfirmationStatus?: (state: RootState) => AuthorizationStepStatus
  getConfirmationError?: (state: RootState) => string | null
  onClose: () => void
  onAuthorized: () => void
  onRevoke: () => ReturnType<typeof authorizationFlowRequest>
  onGrant: () => ReturnType<typeof authorizationFlowRequest>
  onFetchAuthorizations: () => ReturnType<typeof fetchAuthorizationsRequest>
}

export type MapDispatchProps = Pick<Props, 'onRevoke' | 'onGrant' | 'onFetchAuthorizations'>
export type MapDispatch = Dispatch<AuthorizationFlowRequestAction | FetchAuthorizationsRequestAction>
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
  | 'contracts'
  | 'confirmationStatus'
  | 'confirmationError'
>
