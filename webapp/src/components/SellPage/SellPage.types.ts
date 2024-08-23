import { Dispatch } from 'redux'
import { getContract } from '../../modules/contract/selectors'
import { clearOrderErrors, ClearOrderErrorsAction, createOrderRequest, CreateOrderRequestAction } from '../../modules/order/actions'
import { Contract } from '../../modules/vendor/services'

export type Props = {
  isLoading: boolean
  isCreatingOrder: boolean
  isOffchainPublicNFTOrdersEnabled: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onCreateOrder: typeof createOrderRequest
  onClearOrderErrors: typeof clearOrderErrors
}

export type MapStateProps = Pick<Props, 'isLoading' | 'isCreatingOrder' | 'getContract' | 'isOffchainPublicNFTOrdersEnabled'>
export type MapDispatchProps = Pick<Props, 'onCreateOrder' | 'onClearOrderErrors'>
export type MapDispatch = Dispatch<CreateOrderRequestAction | ClearOrderErrorsAction>
