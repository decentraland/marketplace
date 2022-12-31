import { Bid, RentalListing } from '@dcl/schemas'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  nft: NFT | null
  rental: RentalListing | null
  bid: Bid
  userAddress: string
  onClick: () => void
}
