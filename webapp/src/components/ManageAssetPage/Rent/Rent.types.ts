import { RentalListing } from '@dcl/schemas'
import { NFT } from '../../../modules/nft/types'
import { VendorName } from '../../../modules/vendor'

export type Props = {
  className?: string
  nft: NFT
  rental: RentalListing | null
  isClaimingLandBack: boolean
  onClaimLand: () => void
  onCreateOrEditRent: (
    nft: NFT<VendorName>,
    rental: RentalListing | null
  ) => void
}

export type OwnProps = Pick<Props, 'nft' | 'rental'>
export type MapStateProps = Pick<Props, 'isClaimingLandBack'>
export type MapDispatchProps = Pick<Props, 'onClaimLand' | 'onCreateOrEditRent'>
