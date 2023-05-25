import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { List } from '../../modules/favorites/types'

export type Props = {
  isLoading: boolean
  lists: List[]
  count?: number
  onRedirect: (path: string) => void
}

export type MapStateProps = Pick<Props, 'isLoading' | 'count' | 'lists'>

export type MapDispatchProps = Pick<Props, 'onRedirect'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
