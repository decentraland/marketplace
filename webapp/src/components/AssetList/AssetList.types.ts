import { Dispatch } from 'redux'
import { Item } from '@dcl/schemas'

import { NFT } from '../../modules/nft/types'
import { VendorName } from '../../modules/vendor/types'
import {
  browse,
  BrowseAction,
  clearFilters,
  ClearFiltersAction
} from '../../modules/routing/actions'
import { Section } from '../../modules/vendor/routing/types'
import { AssetType } from '../../modules/asset/types'

export type Props = {
  vendor: VendorName
  assetType: AssetType
  section?: Section
  nfts: NFT[]
  items: Item[]
  page: number
  count?: number
  isLoading: boolean
  isManager?: boolean
  hasFiltersEnabled?: boolean
  onBrowse: typeof browse
  onClearFilters: typeof clearFilters
  urlNext: string
  search: string
}

export type MapStateProps = Pick<
  Props,
  | 'vendor'
  | 'section'
  | 'nfts'
  | 'items'
  | 'page'
  | 'count'
  | 'isLoading'
  | 'assetType'
  | 'urlNext'
  | 'search'
  | 'hasFiltersEnabled'
>
export type MapDispatchProps = Pick<Props, 'onBrowse' | 'onClearFilters'>
export type MapDispatch = Dispatch<BrowseAction | ClearFiltersAction>
