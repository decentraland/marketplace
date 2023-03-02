import { Dispatch } from 'redux'
import { ChainId, Network } from '@dcl/schemas'
import {
  switchNetworkRequest,
  SwitchNetworkRequestAction
} from 'decentraland-dapps/dist/modules/wallet/actions'

export type Props = {
  chainId: ChainId
  network: Network
  isBuyWithCardPage: boolean
  onSwitchNetwork: typeof switchNetworkRequest
}

export type MapStateProps = Pick<Props, 'isBuyWithCardPage'>

export type MapDispatchProps = Pick<Props, 'onSwitchNetwork'>
export type MapDispatch = Dispatch<SwitchNetworkRequestAction>

export type OwnProps = Pick<Props, 'chainId' | 'network'>
