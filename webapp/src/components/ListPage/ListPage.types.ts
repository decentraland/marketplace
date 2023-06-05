import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { RouteComponentProps } from 'react-router-dom'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { GoBackAction } from '../../modules/routing/actions'
import { List } from '../../modules/favorites/types'
import {
  GetListRequestAction,
  getListRequest
} from '../../modules/favorites/actions'
import { OpenModalAction, openModal } from '../../modules/modal/actions'

type Params = { listId?: string }

export type Props = {
  wallet: Wallet | null
  isConnecting: boolean
  listId?: string
  list: List | null
  isLoading: boolean
  onFetchList: typeof getListRequest
  onRedirect: (path: string) => void
  onBack: () => void
  onEditList: (list: List) => ReturnType<typeof openModal>
  onDeleteList: (listId: string) => ReturnType<typeof openModal>
  onShareList?: (list: List) => ReturnType<typeof openModal>
} & RouteComponentProps<Params>

export type MapStateProps = Pick<
  Props,
  'wallet' | 'isConnecting' | 'listId' | 'list' | 'isLoading'
>

export type MapDispatchProps = Pick<
  Props,
  | 'onRedirect'
  | 'onBack'
  | 'onFetchList'
  | 'onEditList'
  | 'onDeleteList'
  | 'onShareList'
>
export type MapDispatch = Dispatch<
  | CallHistoryMethodAction
  | GoBackAction
  | GetListRequestAction
  | OpenModalAction
>
export type OwnProps = RouteComponentProps<Params>
