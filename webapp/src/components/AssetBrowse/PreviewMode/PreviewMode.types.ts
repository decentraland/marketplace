import { Dispatch } from 'redux'
import { RouterLocation } from 'connected-react-router'
import { VendorName } from '../../../modules/vendor/types'
import {
  browse,
  BrowseAction
} from '../../../modules/routing/actions'
import { Section } from '../../../modules/vendor/routing/types'
import { Asset, AssetType } from '../../../modules/asset/types'

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
  onBrowse: typeof browse
  search: string
  visitedLocations: RouterLocation<unknown>[]
}

export type MapStateProps = Pick<
  Props,
  | 'vendor'
  | 'section'
  | 'assets'
  | 'page'
  | 'count'
  | 'isLoading'
  | 'assetType'
  | 'search'
  | 'hasFiltersEnabled'
  | 'visitedLocations'
>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseAction>
