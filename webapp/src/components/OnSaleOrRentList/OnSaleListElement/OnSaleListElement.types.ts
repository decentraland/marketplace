import { Item, Order } from '@dcl/schemas'
import { revokeTokenRequest } from 'decentraland-dapps/dist/modules/authorization/actions'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { NFT } from '../../../modules/nft/types'
import { VendorName } from '../../../modules/vendor'

export type Props = {
  item?: Item
  nft?: NFT<VendorName.DECENTRALAND>
  order?: Order
  isAuthorized?: boolean
  authorization?: Authorization | null
  onRevoke?: typeof revokeTokenRequest
}
