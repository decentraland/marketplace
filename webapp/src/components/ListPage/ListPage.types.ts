import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { RouteComponentProps } from 'react-router-dom'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { GoBackAction } from '../../modules/routing/actions'
import { List } from '../../modules/favorites/types'
import {
  DeleteListStartAction,
  GetListRequestAction,
  deleteListStart,
  getListRequest
} from '../../modules/favorites/actions'
import { OpenModalAction, openModal } from '../../modules/modal/actions'

type Params = { listId?: string }

export type Props = {
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
  isListV1Enabled: boolean
} & RouteComponentProps<Params>

export type MapStateProps = Pick<
  Props,
  'wallet' | 'listId' | 'list' | 'isLoading' | 'error' | 'isListV1Enabled'
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
