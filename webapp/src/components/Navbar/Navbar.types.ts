import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'

export type Props = {
  isFullscreen?: boolean
  onNavigate: (path: string) => void
}

export type MapStateProps = {}
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
