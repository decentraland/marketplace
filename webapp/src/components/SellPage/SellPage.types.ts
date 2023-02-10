import { CallHistoryMethodAction } from 'connected-react-router'
import { Dispatch } from 'redux'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { getContract } from '../../modules/contract/selectors'
import { createOrderRequest, CreateOrderRequestAction } from '../../modules/order/actions'
import { Contract } from '../../modules/vendor/services'

export type Props = {
  authorizations: Authorization[]
  isLoading: boolean
  isCreatingOrder: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onCreateOrder: typeof createOrderRequest
  onGoBack: () => void
}

export type MapStateProps = Pick<Props, 'authorizations' | 'isLoading' | 'isCreatingOrder' | 'getContract'>
export type MapDispatchProps = Pick<Props, 'onCreateOrder' | 'onGoBack'>
export type MapDispatch = Dispatch<CallHistoryMethodAction | CreateOrderRequestAction>
