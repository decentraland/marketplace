import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'

export type Props = {
  pathname: string
  hasPendingTransactions: boolean
  isFullscreen?: boolean
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'pathname' | 'hasPendingTransactions'>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
