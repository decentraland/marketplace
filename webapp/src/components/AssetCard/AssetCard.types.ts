import { Order } from '@dcl/schemas'
import { Asset } from '../../modules/asset/types'

export type Props = {
  asset: Asset
  order?: Order
}

export type MapStateProps = Pick<Props, 'order'>
export type MapDispatchProps = {}
export type OwnProps = Pick<Props, 'asset' | 'order'>
