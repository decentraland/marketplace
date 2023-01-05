import { Dispatch } from 'redux'
import { EmotePlayMode, GenderFilterOption, Network, Rarity } from '@dcl/schemas'
import { ModalProps } from 'decentraland-ui/dist/components/Modal/Modal'
import { SortBy } from '../../../modules/routing/types'
import {
  browse,
  clearFilters,
  ClearFiltersAction
} from '../../../modules/routing/actions'
import { Section } from '../../../modules/vendor/routing/types'
import { AssetType } from '../../../modules/asset/types'

export type Props = ModalProps & {
  assetType: AssetType
  section: Section
  sortBy?: SortBy
  onlyOnSale?: boolean
  onlyOnRent?: boolean
  onlySmart?: boolean
  rarities: Rarity[]
  wearableGenders: GenderFilterOption[]
  contracts: string[]
  network?: Network
  emotePlayMode?: EmotePlayMode[]
  hasFiltersEnabled: boolean
  isRentalsEnabled: boolean
  onBrowse: typeof browse
  onClearFilters: typeof clearFilters
}

export type MapStateProps = Pick<
  Props,
  | 'assetType'
  | 'section'
  | 'sortBy'
  | 'onlyOnSale'
  | 'onlyOnRent'
  | 'onlySmart'
  | 'rarities'
  | 'wearableGenders'
  | 'contracts'
  | 'network'
  | 'emotePlayMode'
  | 'hasFiltersEnabled'
  | 'isRentalsEnabled'
>
export type MapDispatchProps = Pick<Props, 'onClearFilters'>
export type MapDispatch = Dispatch<ClearFiltersAction>
export type OwnProps = Pick<Props, 'onBrowse' | 'isMap'>
