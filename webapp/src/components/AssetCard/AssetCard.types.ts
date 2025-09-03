import { Order, RentalListing } from '@dcl/schemas'
import { Asset } from '../../modules/asset/types'
import { BrowseOptions, PageName } from '../../modules/routing/types'

export type Props = {
  asset: Asset
  price: string | null
  order?: Order
  isManager?: boolean
  pageName: PageName
  onClick?: () => void
  isClaimingBackLandTransactionPending: boolean
  showRentalChip: boolean
  rental: RentalListing | null
  sortBy: string | undefined
  appliedFilters: Pick<BrowseOptions, 'minPrice' | 'maxPrice'>
}

export type MapStateProps = Pick<
  Props,
  'pageName' | 'price' | 'showRentalChip' | 'rental' | 'isClaimingBackLandTransactionPending' | 'sortBy' | 'appliedFilters'
>
export type OwnProps = Pick<Props, 'asset' | 'order' | 'isManager'>
export type ContainerProps = Omit<Props, keyof MapStateProps> & { onClick?: () => void }
