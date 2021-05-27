import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import {
  createOrderRequest,
  CreateOrderRequestAction
} from '../../modules/order/actions'

export type Props = {
  authorizations: Authorization[]
  isLoading: boolean
  isCreatingOrder: boolean
  onCreateOrder: typeof createOrderRequest
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<
  Props,
  'authorizations' | 'isLoading' | 'isCreatingOrder'
>
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onCreateOrder'>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | CreateOrderRequestAction
>
