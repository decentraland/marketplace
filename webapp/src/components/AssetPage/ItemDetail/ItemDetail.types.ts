import { Item } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

export type Props = {
  wallet: Wallet | null
  item: Item
}

export type MapStateProps = Pick<Props, 'wallet'>
export type MapDispatchProps = {}
export type MapDispatch = {}
