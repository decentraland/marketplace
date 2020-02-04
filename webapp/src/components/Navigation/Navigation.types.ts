import { CallHistoryMethodAction } from 'connected-react-router'
import { Dispatch } from 'redux'

export enum NavigationTab {
  ATLAS = 'atlas',
  BROWSE = 'browse',
  ACCOUNT = 'account'
}

export type Props = {
  activeTab?: NavigationTab
  isFullscreen?: boolean
  onNavigate: (path: string) => void
}

export type MapStateProps = {}
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
