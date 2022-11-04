import { RentalListing } from '@dcl/schemas'
import { NFT } from '../../../modules/nft/types'
import { VendorName } from '../../../modules/vendor'

export type Props = {
  nft: NFT<VendorName.DECENTRALAND>
  rental: RentalListing
}
