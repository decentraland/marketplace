import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { RouteComponentProps } from 'react-router-dom'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import {
  OpenModalAction,
  openModal
} from 'decentraland-dapps/dist/modules/modal/actions'
import { GoBackAction } from '../../modules/routing/actions'
import { List } from '../../modules/favorites/types'
import {
  DeleteListStartAction,
  GetListRequestAction,
  deleteListStart,
  getListRequest
} from '../../modules/favorites/actions'

type Params = { listId?: string }

export type Props = {
  isConnecting: boolean
  wallet: Wallet | null
  listId?: string
  list: List | null
  isLoading: boolean
  error: string | null
  onFetchList: typeof getListRequest
  onBack: () => void
  onEditList: (list: List) => ReturnType<typeof openModal>
  onDeleteList: typeof deleteListStart
  onShareList?: (list: List) => ReturnType<typeof openModal>
} & RouteComponentProps<Params>

export type MapStateProps = Pick<
  Props,
  'isConnecting' | 'wallet' | 'listId' | 'list' | 'isLoading' | 'error'
>

export type MapDispatchProps = Pick<
  Props,
  'onBack' | 'onFetchList' | 'onEditList' | 'onDeleteList' | 'onShareList'
>
export type MapDispatch = Dispatch<
  | CallHistoryMethodAction
  | GoBackAction
  | GetListRequestAction
  | OpenModalAction
  | DeleteListStartAction
>
export type OwnProps = RouteComponentProps<Params>
