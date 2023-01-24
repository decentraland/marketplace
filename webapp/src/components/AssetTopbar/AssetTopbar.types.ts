import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { AssetType } from '../../modules/asset/types'
import { BrowseOptions } from '../../modules/routing/types'
import { Section } from '../../modules/vendor/routing/types'
import { View } from '../../modules/ui/types'
import { clearFilters } from '../../modules/routing/actions'

export type Props = {
  count: number | undefined
  search: string
  isMap: boolean
  view: View | undefined
  sortBy: string | undefined
  assetType: AssetType
  onlyOnSale: boolean | undefined
  onlyOnRent: boolean | undefined
  section: Section
  hasFiltersEnabled: boolean
  isLoading: boolean
  onBrowse: (options: BrowseOptions) => void
  onClearFilters: typeof clearFilters
  onOpenFiltersModal: () => ReturnType<typeof openModal>
}

export type MapStateProps = Pick<
  Props,
  | 'search'
  | 'isMap'
  | 'count'
  | 'view'
  | 'assetType'
  | 'onlyOnRent'
  | 'onlyOnSale'
  | 'sortBy'
  | 'section'
  | 'hasFiltersEnabled'
  | 'isLoading'
>

export type MapDispatchProps = Pick<
  Props,
  'onBrowse' | 'onClearFilters' | 'onOpenFiltersModal'
>
