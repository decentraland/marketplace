import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { RouteComponentProps } from 'react-router-dom'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { VendorName } from '../../modules/vendor/types'

type Params = { address?: string }

export type Props = {
  addressInUrl?: string
  vendor: VendorName
  wallet: Wallet | null
  isConnecting: boolean
  isFullscreen?: boolean
  viewAsGuest: boolean
  onRedirect: (path: string) => void
} & RouteComponentProps<Params>

export type MapStateProps = Pick<Props, 'addressInUrl' | 'vendor' | 'wallet' | 'isConnecting' | 'isFullscreen' | 'viewAsGuest'>
export type MapDispatchProps = Pick<Props, 'onRedirect'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
export type OwnProps = RouteComponentProps<Params>
