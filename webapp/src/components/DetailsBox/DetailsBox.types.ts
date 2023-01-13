import { Order, RentalListing } from '@dcl/schemas'
import { Asset } from '../../modules/asset/types'

export type Props = {
  asset: Asset
  rental?: RentalListing | null
  order?: Order | null
  className?: string
}

export type MapStateProps = Pick<Props, 'order'>
