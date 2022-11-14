import { Order, RentalListing } from '@dcl/schemas'
import { Asset } from '../../modules/asset/types'

export type Props = {
  asset: Asset
  price: string | null
  order?: Order
  isManager?: boolean
  rental?: RentalListing
  rentalPricePerDay?: string | null
  showListedTag?: boolean
  onClick?: () => void
  isClaimingBackLandTransactionPending: boolean
}

export type MapStateProps = Pick<
  Props,
  | 'showListedTag'
  | 'price'
  | 'rentalPricePerDay'
  | 'isClaimingBackLandTransactionPending'
>
export type MapDispatchProps = {}
export type OwnProps = Pick<Props, 'asset' | 'order' | 'rental' | 'isManager'>
