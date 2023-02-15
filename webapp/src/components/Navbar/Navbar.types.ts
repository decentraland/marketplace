import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { NavbarProps } from 'decentraland-dapps/dist/containers/Navbar/Navbar.types'

export type Props = Partial<NavbarProps> & {
  pathname: string
  isConnected: boolean
  hasPendingTransactions: boolean
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<
  Props,
  'pathname' | 'hasPendingTransactions' | 'isConnected'
>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
