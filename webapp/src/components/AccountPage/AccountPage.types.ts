import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

import { VendorName } from '../../modules/vendor/types'

export type Params = {
  address?: string
}

export type Props = {
  address?: string
  vendor: VendorName
  wallet: Wallet | null
  isConnecting: boolean
  isFullscreen?: boolean
  onRedirect: (path: string) => void
}

export type MapStateProps = Pick<
  Props,
  'address' | 'vendor' | 'wallet' | 'isConnecting' | 'isFullscreen'
>
export type MapDispatchProps = Pick<Props, 'onRedirect'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
