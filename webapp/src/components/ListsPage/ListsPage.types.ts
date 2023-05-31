import { Dispatch } from 'redux'
import { OpenModalAction } from 'decentraland-dapps/dist/modules/modal/actions'
import { List } from '../../modules/favorites/types'
import {
  FetchListsRequestAction,
  fetchListsRequest
} from '../../modules/favorites/actions'

export type Props = {
  isLoading: boolean
  lists: List[]
  count?: number
  onFetchLists: typeof fetchListsRequest
  onCreateList: () => void
}

export type MapStateProps = Pick<Props, 'isLoading' | 'count' | 'lists'>
export type MapDispatchProps = Pick<Props, 'onFetchLists' | 'onCreateList'>
export type MapDispatch = Dispatch<FetchListsRequestAction | OpenModalAction>
