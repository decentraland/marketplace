import { Dispatch } from 'redux'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { CallHistoryMethodAction } from 'connected-react-router'

export type Props = {
  wallet: Wallet | null
  isConnecting: boolean
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'wallet' | 'isConnecting'>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
