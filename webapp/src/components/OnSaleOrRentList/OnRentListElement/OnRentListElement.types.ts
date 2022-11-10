import { RentalListing } from '@dcl/schemas'
import { NFT } from '../../../modules/nft/types'
import { VendorName } from '../../../modules/vendor'

export type Props = {
  nft: NFT<VendorName.DECENTRALAND>
  rental: RentalListing
  isClaimingBackLandTransactionPending: boolean
}

export type OwnProps = Pick<Props, 'nft' | 'rental'>

export type MapStateProps = Pick<Props, 'isClaimingBackLandTransactionPending'>
