import { Dispatch } from 'redux'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Authorizations } from '../../modules/authorization/types'

export type Props = {
  wallet: Wallet | null
  authorizations: Authorizations | null
  pendingAllowTransactions: Transaction[]
  pendingApproveTransactions: Transaction[]
  isConnecting: boolean
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<
  Props,
  | 'wallet'
  | 'authorizations'
  | 'pendingAllowTransactions'
  | 'pendingApproveTransactions'
  | 'isConnecting'
>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
