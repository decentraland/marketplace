import { Dispatch } from 'redux'
import { Network, Rarity } from '@dcl/schemas'
import { SortBy } from '../../../../modules/routing/types'
import {
  browse,
  clearFilters,
  ClearFiltersAction
} from '../../../../modules/routing/actions'
import { WearableGender } from '../../../../modules/nft/wearable/types'
import { AssetType } from '../../../../modules/asset/types'

export type Props = {
  assetType: AssetType
  count?: number
  section: string
  sortBy?: SortBy
  search: string
  onlyOnSale?: boolean
  onlySmart?: boolean
  isMap?: boolean
  wearableRarities: Rarity[]
  wearableGenders: WearableGender[]
  contracts: string[]
  network?: Network
  hasFiltersEnabled: boolean
  onBrowse: typeof browse
  onClearFilters: typeof clearFilters
}

export type MapStateProps = Pick<
  Props,
  | 'assetType'
  | 'count'
  | 'section'
  | 'sortBy'
  | 'search'
  | 'onlyOnSale'
  | 'onlySmart'
  | 'isMap'
  | 'wearableRarities'
  | 'wearableGenders'
  | 'contracts'
  | 'network'
  | 'hasFiltersEnabled'
>
export type MapDispatchProps = Pick<Props, 'onClearFilters'>
export type MapDispatch = Dispatch<ClearFiltersAction>
export type OwnProps = Pick<Props, 'onBrowse' | 'isMap'>
