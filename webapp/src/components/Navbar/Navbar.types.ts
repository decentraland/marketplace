import { Dispatch } from 'redux'
import { CallHistoryMethodAction, RouterLocation } from 'connected-react-router'
import { NavbarProps } from 'decentraland-ui'
import { AuthIdentity } from '@dcl/crypto'

export type Props = Partial<NavbarProps> & {
  location: RouterLocation<unknown>
  hasPendingTransactions: boolean
  enablePartialSupportAlert?: boolean
  onNavigate: (path: string) => void
  identity?: AuthIdentity
  isAuthDappEnabled: boolean
}

export type OwnProps = Pick<Props, 'enablePartialSupportAlert'>

export type MapStateProps = Pick<
  Props,
  | 'location'
  | 'hasPendingTransactions'
  | 'identity'
  | 'isAuthDappEnabled'
>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
