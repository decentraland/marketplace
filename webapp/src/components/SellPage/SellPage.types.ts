import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { clearOrderErrors, ClearOrderErrorsAction, createOrderRequest, CreateOrderRequestAction } from '../../modules/order/actions'
import { Contract } from '../../modules/vendor/services'
import { getContract } from '../../modules/contract/selectors'

export type Props = {
  isLoading: boolean
  isCreatingOrder: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onCreateOrder: typeof createOrderRequest
  onGoBack: () => void
  onClearOrderErrors: typeof clearOrderErrors
}

export type MapStateProps = Pick<Props, 'isLoading' | 'isCreatingOrder' | 'getContract'>
export type MapDispatchProps = Pick<Props, 'onCreateOrder' | 'onGoBack' | 'onClearOrderErrors'>
export type MapDispatch = Dispatch<CallHistoryMethodAction | CreateOrderRequestAction | ClearOrderErrorsAction>
