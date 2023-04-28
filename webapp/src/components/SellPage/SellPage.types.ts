import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import {
  createOrderRequest,
  CreateOrderRequestAction
} from '../../modules/order/actions'
import { Contract } from '../../modules/vendor/services'
import { getContract } from '../../modules/contract/selectors'

export type Props = {
  authorizations: Authorization[]
  isLoading: boolean
  isCreatingOrder: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onCreateOrder: typeof createOrderRequest
  onGoBack: () => void
}

export type MapStateProps = Pick<
  Props,
  'authorizations' | 'isLoading' | 'isCreatingOrder' | 'getContract'
>
export type MapDispatchProps = Pick<Props, 'onCreateOrder' | 'onGoBack'>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | CreateOrderRequestAction
>
