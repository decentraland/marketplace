import { RentalListing } from '@dcl/schemas'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  className?: string
  nft: NFT
  rental: RentalListing | null
  isClaimingLandBack: boolean
  onClaimLand: () => void
}

export type OwnProps = Pick<Props, 'nft' | 'rental'>
export type MapStateProps = Pick<Props, 'isClaimingLandBack'>
export type MapDispatchProps = Pick<Props, 'onClaimLand'>
