import { CallHistoryMethodAction } from 'connected-react-router'
import { Dispatch } from 'redux'

export type Props = {
  address?: string
  activeTab?: 'atlas' | 'market' | 'address'
  isFullscreen?: boolean
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'address'>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
