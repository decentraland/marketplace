import { Order, RentalListing } from '@dcl/schemas'
import { Asset } from '../../modules/asset/types'

export type Props = {
  asset: Asset
  price: string | null
  order?: Order
  rental?: RentalListing
  rentalPricePerDay?: string | null
  showListedTag?: boolean
  onClick?: () => void
}

export type MapStateProps = Pick<
  Props,
  'showListedTag' | 'price' | 'rentalPricePerDay'
>
export type MapDispatchProps = {}
export type OwnProps = Pick<Props, 'asset' | 'order' | 'rental'>
