import { Dispatch } from 'redux'
import { CallHistoryMethodAction, RouterLocation } from 'connected-react-router'
import { NavbarProps } from 'decentraland-ui/dist/components/Navbar/Navbar.types'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

export type Props = Partial<NavbarProps> & {
  wallet: Wallet | null
  location: RouterLocation<unknown>
  hasPendingTransactions: boolean
  enablePartialSupportAlert?: boolean
  onNavigate: (path: string) => void
  isAuthDappEnabled: boolean
}

export type OwnProps = Pick<Props, 'enablePartialSupportAlert'>

export type MapStateProps = Pick<
  Props,
  'location' | 'hasPendingTransactions' | 'isAuthDappEnabled' | 'wallet'
>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
