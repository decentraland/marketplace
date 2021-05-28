import {
  grantTokenRequest,
  GrantTokenRequestAction,
  revokeTokenRequest,
  RevokeTokenRequestAction
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { Dispatch } from 'redux'

export type Props = {
  authorization: Authorization
  authorizations: Authorization[]
  pendingTransactions: Transaction[]
  loading: LoadingState
  onGrant: typeof grantTokenRequest
  onRevoke: typeof revokeTokenRequest
}

export type MapStateProps = Pick<
  Props,
  'authorizations' | 'pendingTransactions' | 'loading'
>
export type MapDispatchProps = Pick<Props, 'onGrant' | 'onRevoke'>
export type MapDispatch = Dispatch<
  GrantTokenRequestAction | RevokeTokenRequestAction
>
