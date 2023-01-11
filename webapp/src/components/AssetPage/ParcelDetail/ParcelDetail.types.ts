import { Order, RentalListing } from '@dcl/schemas'
import { NFT } from '../../../modules/nft/types'
import { VendorName } from '../../../modules/vendor/types'

export type Props = {
  nft: NFT<VendorName.DECENTRALAND>
  order: Order | null
  rental: RentalListing | null
}
