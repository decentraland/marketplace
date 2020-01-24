import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import {
  createOrderRequest,
  CreateOrderRequestAction
} from '../../modules/order/actions'
import { Order } from '../../modules/order/types'

export type Props = {
  order: Order | null
  onCreateOrder: typeof createOrderRequest
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'order'>
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onCreateOrder'>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | CreateOrderRequestAction
>
