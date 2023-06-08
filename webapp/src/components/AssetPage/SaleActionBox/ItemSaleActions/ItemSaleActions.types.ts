import { Item } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

export type Props = {
  item: Item
  wallet?: Wallet | null
  customClassnames?: { [key: string]: string } | undefined
}

export type OwnProps = Pick<Props, 'item' | 'customClassnames'>
export type MapStateProps = Pick<Props, 'wallet'>
