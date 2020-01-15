import { CallHistoryMethodAction } from 'connected-react-router'
import { Dispatch } from 'redux'

export type NavigationTab = 'atlas' | 'market' | 'account'

export type Props = {
  address?: string
  activeTab?: NavigationTab
  isFullscreen?: boolean
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'address'>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
