import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

export type Params = {
  address?: string
}

export type Props = {
  address?: string
  wallet: Wallet | null
  isConnecting: boolean
  onNavigate: (path: string) => void
  onRedirect: (path: string) => void
}

export type MapStateProps = Pick<Props, 'address' | 'wallet' | 'isConnecting'>
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onRedirect'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
