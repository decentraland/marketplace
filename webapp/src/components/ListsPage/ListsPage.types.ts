import { Dispatch } from 'redux'
import { List } from '../../modules/favorites/types'
import {
  FetchListsRequestAction,
  fetchListsRequest
} from '../../modules/favorites/actions'

export type Props = {
  isLoading: boolean
  lists: List[]
  count?: number
  fetchLists: typeof fetchListsRequest
}

export type MapStateProps = Pick<Props, 'isLoading' | 'count' | 'lists'>
export type MapDispatchProps = Pick<Props, 'fetchLists'>
export type MapDispatch = Dispatch<FetchListsRequestAction>
