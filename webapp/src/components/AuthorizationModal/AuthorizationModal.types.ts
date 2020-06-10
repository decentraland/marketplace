import { Dispatch } from 'redux'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { Authorizations } from '../../modules/authorization/types'
import {
  allowTokenRequest,
  approveTokenRequest,
  AllowTokenRequestAction,
  ApproveTokenRequestAction
} from '../../modules/authorization/actions'

export enum AuthorizationType {
  ALLOWANCE = 'allowance',
  APPROVAL = 'approval'
}

export type Props = {
  open: boolean
  contractAddress: string
  tokenAddress: string
  type: AuthorizationType
  authorizations: Authorizations
  pendingTransactions: Transaction[]
  onAllow: typeof allowTokenRequest
  onApprove: typeof approveTokenRequest
  onCancel: () => void
  onProceed: () => void
}

export type MapStateProps = Pick<
  Props,
  'authorizations' | 'pendingTransactions'
>
export type MapDispatchProps = Pick<Props, 'onAllow' | 'onApprove'>
export type MapDispatch = Dispatch<
  AllowTokenRequestAction | ApproveTokenRequestAction
>
export type OwnProps = Pick<
  Props,
  'open' | 'contractAddress' | 'tokenAddress' | 'type' | 'onProceed'
>
