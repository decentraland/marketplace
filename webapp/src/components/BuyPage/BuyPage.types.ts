import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Authorizations } from '../../modules/authorization/types'
import {
  executeOrderRequest,
  ExecuteOrderRequestAction
} from '../../modules/order/actions'

export type Props = {
  authorizations: Authorizations
  onExecuteOrder: typeof executeOrderRequest
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'authorizations'>
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onExecuteOrder'>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | ExecuteOrderRequestAction
>
