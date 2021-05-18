import { Dispatch } from 'redux'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import {
  grantTokenRequest,
  GrantTokenRequestAction,
  revokeTokenRequest,
  RevokeTokenRequestAction
} from 'decentraland-dapps/dist/modules/authorization/actions'

export type Props = {
  open: boolean
  authorization: Authorization
  authorizations: Authorization[]
  pendingTransactions: Transaction[]
  isLoading: boolean
  onGrant: typeof grantTokenRequest
  onRevoke: typeof revokeTokenRequest
  onCancel: () => void
  onProceed: () => void
}

export type MapStateProps = Pick<
  Props,
  'authorizations' | 'pendingTransactions' | 'isLoading'
>
export type MapDispatchProps = Pick<Props, 'onGrant' | 'onRevoke'>
export type MapDispatch = Dispatch<
  GrantTokenRequestAction | RevokeTokenRequestAction
>
export type OwnProps = Pick<Props, 'open' | 'authorization' | 'onProceed'>
