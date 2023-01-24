import { Item } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

export type Props = {
  item: Item
  wallet: Wallet | null
}

export type OwnProps = Pick<Props, 'item'>
export type MapStateProps = Pick<Props, 'wallet'>
