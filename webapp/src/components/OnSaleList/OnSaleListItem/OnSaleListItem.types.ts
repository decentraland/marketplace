import { Item } from '@dcl/schemas'
import { NFT } from '../../../modules/nft/types'
import { Order } from '../../../modules/order/types'
import { VendorName } from '../../../modules/vendor'

export type Props = {
  item?: Item
  nft?: NFT<VendorName.DECENTRALAND>
  order?: Order
}
