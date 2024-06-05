import { Dispatch } from 'redux'
import { cancelOrderRequest, CancelOrderRequestAction } from '../../modules/order/actions'

export type Props = {
  isLoading: boolean
  onCancelOrder: typeof cancelOrderRequest
}

export type MapStateProps = Pick<Props, 'isLoading'>
export type MapDispatchProps = Pick<Props, 'onCancelOrder'>
export type MapDispatch = Dispatch<CancelOrderRequestAction>
