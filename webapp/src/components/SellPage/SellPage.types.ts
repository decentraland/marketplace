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
  isRentalsEnabled: boolean
  onCreateOrder: typeof createOrderRequest
  onNavigate: (path: string) => void
  onGoBack: () => void
}

export type MapStateProps = Pick<
  Props,
  'authorizations' | 'isLoading' | 'isCreatingOrder' | 'isRentalsEnabled'
>
export type MapDispatchProps = Pick<
  Props,
  'onNavigate' | 'onCreateOrder' | 'onGoBack'
>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | CreateOrderRequestAction
>
