import { Order, RentalListing } from '@dcl/schemas'
import { Asset } from '../../modules/asset/types'

export type Props = {
  asset: Asset
  price: string | null
  order?: Order
  isManager?: boolean
  showListedTag?: boolean
  onClick?: () => void
  isClaimingBackLandTransactionPending: boolean
  showRentalChip: boolean
  rental: RentalListing | null
}

export type MapStateProps = Pick<
  Props,
  | 'showListedTag'
  | 'price'
  | 'showRentalChip'
  | 'rental'
  | 'isClaimingBackLandTransactionPending'
>
export type MapDispatchProps = {}
export type OwnProps = Pick<Props, 'asset' | 'order' | 'isManager'>
