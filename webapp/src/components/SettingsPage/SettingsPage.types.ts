import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import {
  grantTokenRequest,
  GrantTokenRequestAction,
  revokeTokenRequest,
  RevokeTokenRequestAction
} from 'decentraland-dapps/dist/modules/authorization/actions'

export type Props = {
  wallet: Wallet | null
  authorizations: Authorization[]
  pendingTransactions: Transaction[]
  isLoadingAuthorization: boolean
  hasError: boolean
  isConnecting: boolean
  onGrant: typeof grantTokenRequest
  onRevoke: typeof revokeTokenRequest
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<
  Props,
  | 'wallet'
  | 'authorizations'
  | 'pendingTransactions'
  | 'isLoadingAuthorization'
  | 'isConnecting'
  | 'hasError'
>
export type MapDispatchProps = Pick<
  Props,
  'onGrant' | 'onRevoke' | 'onNavigate'
>
export type MapDispatch = Dispatch<
  GrantTokenRequestAction | RevokeTokenRequestAction | CallHistoryMethodAction
>
