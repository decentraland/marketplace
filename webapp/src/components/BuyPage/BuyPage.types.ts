import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import {
  executeOrderRequest,
  ExecuteOrderRequestAction
} from '../../modules/order/actions'
import { Order } from '../../modules/order/types'

export type Props = {
  order: Order | null
  onExecuteOrder: typeof executeOrderRequest
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'order'>
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onExecuteOrder'>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | ExecuteOrderRequestAction
>
