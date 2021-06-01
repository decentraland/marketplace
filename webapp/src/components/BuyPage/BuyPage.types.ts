import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import {
  executeOrderRequest,
  ExecuteOrderRequestAction
} from '../../modules/order/actions'

export type Props = {
  wallet: Wallet | null
  authorizations: Authorization[]
  isLoading: boolean
  isExecutingOrder: boolean
  onExecuteOrder: typeof executeOrderRequest
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<
  Props,
  'wallet' | 'authorizations' | 'isLoading' | 'isExecutingOrder'
>
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onExecuteOrder'>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | ExecuteOrderRequestAction
>
