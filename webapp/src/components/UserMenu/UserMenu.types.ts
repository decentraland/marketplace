import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import {
  ConnectWalletRequestAction,
  DisconnectWalletAction
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { Profile } from 'decentraland-dapps/dist/modules/profile/types'

export type Props = {
  isLoggedIn: boolean
  isLoggingIn: boolean
  address?: string
  mana?: number
  profile?: Profile
  onLogout: () => void
  onLogin: () => void
  pathname: string
  hasPendingTransactions: boolean
  onNavigate: (path: string) => void
}

export type State = {
  isOpen: boolean
}

export type MapStateProps = Pick<
  Props,
  | 'isLoggedIn'
  | 'isLoggingIn'
  | 'address'
  | 'profile'
  | 'mana'
  | 'pathname'
  | 'hasPendingTransactions'
>
export type MapDispatchProps = Pick<
  Props,
  'onLogin' | 'onLogout' | 'onNavigate'
>
export type MapDispatch = Dispatch<
  ConnectWalletRequestAction | DisconnectWalletAction | CallHistoryMethodAction
>
