import { Dispatch } from 'redux'
import { getContract } from '../../modules/contract/selectors'
import {
  cancelOrderRequest,
  CancelOrderRequestAction,
  clearOrderErrors,
  ClearOrderErrorsAction,
  createOrderRequest,
  CreateOrderRequestAction
} from '../../modules/order/actions'
import { Contract } from '../../modules/vendor/services'

export type Props = {
  isLoading: boolean
  isCreatingOrder: boolean
  isOffchainPublicNFTOrdersEnabled: boolean
  isLoadingCancelOrder: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onCreateOrder: typeof createOrderRequest
  onClearOrderErrors: typeof clearOrderErrors
  onCancelOrder: typeof cancelOrderRequest
}

export type MapStateProps = Pick<
  Props,
  'isLoading' | 'isCreatingOrder' | 'getContract' | 'isOffchainPublicNFTOrdersEnabled' | 'isLoadingCancelOrder'
>
export type MapDispatchProps = Pick<Props, 'onCreateOrder' | 'onClearOrderErrors' | 'onCancelOrder'>
export type MapDispatch = Dispatch<CreateOrderRequestAction | ClearOrderErrorsAction | CancelOrderRequestAction>
