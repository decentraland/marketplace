import { NFT } from '../../../modules/nft/types'
import { VendorName } from '../../../modules/vendor/types'

export type Props = {
  nft: NFT<VendorName.DECENTRALAND>
  isRentalsEnabled: boolean
}
