import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import {
  executeOrderRequest,
  ExecuteOrderRequestAction
} from '../../modules/order/actions'
import { ResultType } from '../../modules/routing/types'
import {
  buyItemRequest,
  buyItemRequestAction
} from '../../modules/item/actions'

export type Props = {
  type: ResultType
  wallet: Wallet | null
  authorizations: Authorization[]
  isLoading: boolean
  isExecutingOrder: boolean
  onExecuteOrder: typeof executeOrderRequest
  onBuyItem: typeof buyItemRequest
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<
  Props,
  'wallet' | 'authorizations' | 'isLoading' | 'isExecutingOrder'
>
export type MapDispatchProps = Pick<
  Props,
  'onNavigate' | 'onExecuteOrder' | 'onBuyItem'
>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | ExecuteOrderRequestAction | buyItemRequestAction
>
export type OwnProps = Pick<Props, 'type'>
