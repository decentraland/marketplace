import {
  grantTokenRequest,
  GrantTokenRequestAction,
  revokeTokenRequest,
  RevokeTokenRequestAction
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { Dispatch } from 'redux'
import { getContract } from '../../../modules/contract/selectors'
import { Contract } from '../../../modules/vendor/services'

export type Props = {
  authorization: Authorization
  authorizations: Authorization[]
  pendingTransactions: Transaction[]
  isLoading: boolean
  shouldUpdateSpendingCap?: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onGrant: typeof grantTokenRequest
  onRevoke: typeof revokeTokenRequest
}

export type OwnProps = Pick<Props, 'authorization'>
export type MapStateProps = Pick<Props, 'authorizations' | 'pendingTransactions' | 'isLoading' | 'getContract'>
export type MapDispatchProps = Pick<Props, 'onGrant' | 'onRevoke'>
export type MapDispatch = Dispatch<GrantTokenRequestAction | RevokeTokenRequestAction>
