import { RentalListing } from '@dcl/schemas'
import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset
  rental?: RentalListing | null
  className?: string
}
