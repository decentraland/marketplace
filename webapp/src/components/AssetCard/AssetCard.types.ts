import { Asset } from '../../modules/asset/types'
import { Order } from '../../modules/order/types'

export type Props = {
  asset: Asset
  price: string | null
  order?: Order
  showListedTag?: boolean
}

export type MapStateProps = Pick<Props, 'showListedTag' | 'price'>
export type MapDispatchProps = {}
export type OwnProps = Pick<Props, 'asset' | 'order'>
