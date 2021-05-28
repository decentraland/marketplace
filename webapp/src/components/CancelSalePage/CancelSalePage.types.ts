import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import {
  cancelOrderRequest,
  CancelOrderRequestAction
} from '../../modules/order/actions'

export type Props = {
  isLoading: boolean
  onCancelOrder: typeof cancelOrderRequest
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'isLoading'>
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onCancelOrder'>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | CancelOrderRequestAction
>
