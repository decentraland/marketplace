import { RefObject } from 'react'
import { Dispatch } from 'redux'
import { Order } from '@dcl/schemas'
import { OpenModalAction } from 'decentraland-dapps/dist/modules/modal/actions'
import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset | null
  tableRef?: RefObject<HTMLDivElement> | null
  onBuyWithCrypto: (order?: Order) => void
}

export enum BuyOptions {
  MINT = 'MINT',
  BUY_LISTING = 'BUY_LISTING'
}

export type OwnProps = Omit<Props, 'onBuyWithCrypto'>

export type MapDispatchProps = Pick<Props, 'onBuyWithCrypto'>
export type MapDispatch = Dispatch<OpenModalAction>
