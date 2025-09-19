import { Asset, AssetType } from '../../modules/asset/types'
import { browse, clearFilters } from '../../modules/routing/actions'
import { Section } from '../../modules/vendor/routing/types'
import { VendorName } from '../../modules/vendor/types'

export type Props = {
  vendor: VendorName
  assetType: AssetType
  section?: Section
  assets: Asset[]
  page: number
  count?: number
  isLoading: boolean
  isManager?: boolean
  hasFiltersEnabled?: boolean
  onBrowse: ActionFunction<typeof browse>
  onClearFilters: ActionFunction<typeof clearFilters>
  search: string
}

export type ContainerProps = Pick<Props, 'isManager'>
