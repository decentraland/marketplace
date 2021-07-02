import {
  grantTokenRequest,
  GrantTokenRequestAction,
  revokeTokenRequest,
  RevokeTokenRequestAction
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { Dispatch } from 'redux'

export type Props = {
  authorization: Authorization
  authorizations: Authorization[]
  pendingTransactions: Transaction[]
  isLoading: boolean
  onGrant: typeof grantTokenRequest
  onRevoke: typeof revokeTokenRequest
}

export type OwnProps = Pick<Props, 'authorization'>
export type MapStateProps = Pick<
  Props,
  'authorizations' | 'pendingTransactions' | 'isLoading'
>
export type MapDispatchProps = Pick<Props, 'onGrant' | 'onRevoke'>
export type MapDispatch = Dispatch<
  GrantTokenRequestAction | RevokeTokenRequestAction
>
