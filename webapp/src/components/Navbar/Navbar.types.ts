import { Dispatch } from 'redux'
import { CallHistoryMethodAction, RouterLocation } from 'connected-react-router'
import { NavbarProps } from 'decentraland-ui'

export type Props = Partial<NavbarProps> & {
  location: RouterLocation<unknown>
  isConnected: boolean
  hasPendingTransactions: boolean
  enablePartialSupportAlert?: boolean
  onNavigate: (path: string) => void
}

export type OwnProps = Pick<Props, 'enablePartialSupportAlert'>

export type MapStateProps = Pick<
  Props,
  'location' | 'hasPendingTransactions' | 'isConnected'
>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
