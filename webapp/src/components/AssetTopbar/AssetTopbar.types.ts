import { AssetType } from '../../modules/asset/types'
import { BrowseOptions, SortByOption } from '../../modules/routing/types'
import { View } from '../../modules/ui/types'
import { Section } from '../../modules/vendor/routing/types'

export type Props = {
  count: number | undefined
  search: string
  isMap: boolean
  view: View | undefined
  sortBy: string | undefined
  sortByOptions: SortByOption[]
  assetType: AssetType
  onlyOnSale: boolean | undefined
  onlyOnRent: boolean | undefined
  section: Section
  hasFiltersEnabled: boolean
  isLoading: boolean
  disableSearchDropdown?: boolean
  onBrowse: (options: BrowseOptions) => void
  onClearFilters: () => unknown
  onOpenFiltersModal: () => unknown
}

export type ContainerProps = Pick<Props, 'disableSearchDropdown'>
