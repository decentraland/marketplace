import { Dispatch } from 'redux'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { CallHistoryMethodAction } from 'connected-react-router'

import { Authorizations } from '../../modules/authorization/types'
import {
  AllowTokenRequestAction,
  ApproveTokenRequestAction,
  allowTokenRequest,
  approveTokenRequest
} from '../../modules/authorization/actions'

export type Props = {
  wallet: Wallet | null
  authorizations: Authorizations | undefined
  pendingAllowTransactions: Transaction[]
  pendingApproveTransactions: Transaction[]
  isLoadingAuthorization: boolean
  isConnecting: boolean
  onAllowToken: typeof allowTokenRequest
  onApproveToken: typeof approveTokenRequest
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<
  Props,
  | 'wallet'
  | 'authorizations'
  | 'pendingAllowTransactions'
  | 'pendingApproveTransactions'
  | 'isLoadingAuthorization'
  | 'isConnecting'
>
export type MapDispatchProps = Pick<
  Props,
  'onAllowToken' | 'onApproveToken' | 'onNavigate'
>
export type MapDispatch = Dispatch<
  AllowTokenRequestAction | ApproveTokenRequestAction | CallHistoryMethodAction
>
