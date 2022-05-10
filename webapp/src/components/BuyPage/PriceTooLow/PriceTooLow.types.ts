import { Dispatch } from 'redux'
import { Item } from '@dcl/schemas'
import {
  switchNetworkRequest,
  SwitchNetworkRequestAction
} from 'decentraland-dapps/dist/modules/wallet/actions'

export type Props = {
  item: Item
  onSwitchNetwork: typeof switchNetworkRequest
}

export type MapDispatchProps = Pick<Props, 'onSwitchNetwork'>
export type MapDispatch = Dispatch<SwitchNetworkRequestAction>
