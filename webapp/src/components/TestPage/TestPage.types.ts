import { Dispatch } from 'redux'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import {
  sendMANARequest,
  SendMANARequestAction
} from '../../modules/test/actions'

export type Props = {
  transactions: Transaction[]
  onSend: typeof sendMANARequest
}

export type State = {
  address: string
  amount: string
}

export type MapStateProps = Pick<Props, 'transactions'>
export type MapDispatchProps = Pick<Props, 'onSend'>
export type MapDispatch = Dispatch<SendMANARequestAction>
