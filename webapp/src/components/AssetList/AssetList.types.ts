import { Dispatch } from 'redux'
import { CatalogItem } from '@dcl/schemas'
import { VendorName } from '../../modules/vendor/types'
import {
  browse,
  BrowseAction,
  clearFilters,
  ClearFiltersAction
} from '../../modules/routing/actions'
import { Section } from '../../modules/vendor/routing/types'

export type Props = {
  vendor: VendorName
  section?: Section
  page: number
  count?: number
  isLoading: boolean
  isManager?: boolean
  hasFiltersEnabled?: boolean
  onBrowse: typeof browse
  onClearFilters: typeof clearFilters
  urlNext: string
  search: string
  catalogItems: CatalogItem[]
}

export type MapStateProps = Pick<
  Props,
  | 'vendor'
  | 'section'
  | 'page'
  | 'count'
  | 'isLoading'
  | 'urlNext'
  | 'search'
  | 'hasFiltersEnabled'
  | 'catalogItems'
>
export type MapDispatchProps = Pick<Props, 'onBrowse' | 'onClearFilters'>
export type MapDispatch = Dispatch<BrowseAction | ClearFiltersAction>
