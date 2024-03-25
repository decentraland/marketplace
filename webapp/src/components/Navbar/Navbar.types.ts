import { CallHistoryMethodAction, RouterLocation } from 'connected-react-router'
import { Dispatch } from 'redux'
import { AuthIdentity } from '@dcl/crypto'
import { NavbarProps } from 'decentraland-ui/dist/components/Navbar/Navbar.types'

export type Props = Partial<NavbarProps> & {
  location: RouterLocation<unknown>
  hasPendingTransactions: boolean
  enablePartialSupportAlert?: boolean
  onNavigate: (path: string) => void
  identity?: AuthIdentity
  isChainSelectorEnabled: boolean
}

export type OwnProps = Pick<Props, 'enablePartialSupportAlert'>

export type MapStateProps = Pick<Props, 'location' | 'hasPendingTransactions' | 'identity' | 'isChainSelectorEnabled'>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
