import {
  connectWalletRequest,
  ConnectWalletRequestAction
} from '../../modules/wallet/actions'
import { Dispatch } from 'redux'

export type DefaultProps = {
  children: React.ReactNode | null
}

export type Props = DefaultProps & {
  onConnect: typeof connectWalletRequest
}

export type MapStateProps = {}
export type MapDispatchProps = Pick<Props, 'onConnect'>
export type MapDispatch = Dispatch<ConnectWalletRequestAction>
