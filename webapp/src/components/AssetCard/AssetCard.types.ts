import { Asset } from '../../modules/asset/types'
import { Order } from '../../modules/order/types'

export type Props = {
  asset: Asset
  order?: Order
}

export type MapStateProps = Pick<Props, 'order'>
export type MapDispatchProps = {}
export type OwnProps = Pick<Props, 'asset' | 'order'>
