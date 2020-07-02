import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

import { Vendors } from '../../modules/vendor/types'

export type Params = {
  address?: string
}

export type Props = {
  address?: string
  vendor: Vendors
  wallet: Wallet | null
  isConnecting: boolean
  onRedirect: (path: string) => void
}

export type MapStateProps = Pick<
  Props,
  'address' | 'vendor' | 'wallet' | 'isConnecting'
>
export type MapDispatchProps = Pick<Props, 'onRedirect'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
