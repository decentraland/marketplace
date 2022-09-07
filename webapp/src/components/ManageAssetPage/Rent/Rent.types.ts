import { RentalListing } from '@dcl/schemas'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  className?: string
  nft: NFT
  rental?: RentalListing | null
  isClaimingLandBack: boolean
}

export type MapStateProps = Pick<Props, 'isClaimingLandBack'>
