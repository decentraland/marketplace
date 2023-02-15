import { ChainId } from '@dcl/schemas'
import { Dispatch } from 'redux'
import {
  switchNetworkRequest,
  SwitchNetworkRequestAction
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { AssetType } from '../../modules/asset/types'

export type Props = {
  type: AssetType
  appChainId: ChainId
  onSwitchNetwork: typeof switchNetworkRequest
}

export type MapStateProps = Pick<Props, 'appChainId'>
export type MapDispatchProps = Pick<Props, 'onSwitchNetwork'>
export type OwnProps = Pick<Props, 'type'>
export type MapDispatch = Dispatch<SwitchNetworkRequestAction>
