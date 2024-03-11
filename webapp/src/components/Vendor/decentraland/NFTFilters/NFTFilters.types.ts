import { Dispatch } from 'redux'
import { EmotePlayMode, GenderFilterOption, Network, Rarity, WearableGender } from '@dcl/schemas'
import { SortBy } from '../../../../modules/routing/types'
import { browse, clearFilters, ClearFiltersAction } from '../../../../modules/routing/actions'
import { Section } from '../../../../modules/vendor/routing/types'
import { AssetType } from '../../../../modules/asset/types'
import { View } from '../../../../modules/ui/types'

export type Props = {
  assetType: AssetType
  count?: number
  section: Section
  view?: View
  sortBy?: SortBy
  search: string
  onlyOnSale?: boolean
  onlyOnRent?: boolean
  onlySmart?: boolean
  isMap?: boolean
  rarities: Rarity[]
  wearableGenders: (WearableGender | GenderFilterOption)[]
  contracts: string[]
  network?: Network
  emotePlayMode?: EmotePlayMode[]
  hasFiltersEnabled: boolean
  onBrowse: typeof browse
  onClearFilters: typeof clearFilters
}

export type MapStateProps = Pick<
  Props,
  | 'view'
  | 'assetType'
  | 'count'
  | 'section'
  | 'sortBy'
  | 'search'
  | 'onlyOnSale'
  | 'onlyOnRent'
  | 'onlySmart'
  | 'isMap'
  | 'rarities'
  | 'wearableGenders'
  | 'contracts'
  | 'network'
  | 'emotePlayMode'
  | 'hasFiltersEnabled'
>
export type MapDispatchProps = Pick<Props, 'onClearFilters'>
export type MapDispatch = Dispatch<ClearFiltersAction>
export type OwnProps = Pick<Props, 'onBrowse' | 'isMap'>
