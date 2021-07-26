import { Item } from '@dcl/schemas'
import { Order } from '../../modules/order/types'
import { NFT } from '../../modules/nft/types'

export type Props = {
  asset: NFT | Item
  order?: Order
}

export type MapStateProps = Pick<Props, 'order'>
export type MapDispatchProps = {}
export type OwnProps = Pick<Props, 'asset' | 'order'>
