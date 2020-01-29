import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { Privilege } from '../../../modules/authorization/types'
import {
  allowTokenRequest,
  approveTokenRequest
} from '../../../modules/authorization/actions'

export type Props = {
  contractAddress: string
  privilege?: Privilege
  pendingTransactions: Transaction[]
  onChange: typeof allowTokenRequest | typeof approveTokenRequest
}

export type MapStateProps = Pick<
  Props,
  'contractAddress' | 'privilege' | 'pendingTransactions'
>
export type MapDispatchProps = {}
export type MapDispatch = {}
