import { Bid, RentalListing } from '@dcl/schemas'
import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset | null
  rental: RentalListing | null
  bid: Bid
  userAddress: string
  onClick: () => void
}
