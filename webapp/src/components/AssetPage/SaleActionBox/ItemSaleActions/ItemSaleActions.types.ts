import { Dispatch } from 'redux'
import { Item } from '@dcl/schemas'
import { OpenModalAction } from 'decentraland-dapps/dist/modules/modal/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

export type Props = {
  item: Item
  wallet?: Wallet | null
  onBuyWithCrypto: () => void
  customClassnames?: { [key: string]: string } | undefined
}

export type OwnProps = Pick<Props, 'item' | 'customClassnames'>
export type MapStateProps = Pick<Props, 'wallet'>

export type MapDispatchProps = Pick<Props, 'onBuyWithCrypto'>
export type MapDispatch = Dispatch<OpenModalAction>
