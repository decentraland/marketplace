import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import {
  cancelOrderRequest,
  CancelOrderRequestAction
} from '../../modules/order/actions'

export type Props = {
  onCancelOrder: typeof cancelOrderRequest
  onNavigate: (path: string) => void
}

export type MapStateProps = {}
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onCancelOrder'>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | CancelOrderRequestAction
>
