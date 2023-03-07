import {
  EmotePlayMode,
  GenderFilterOption,
  Network,
  NFTCategory,
  Rarity,
  WearableGender
} from '@dcl/schemas'
import { AssetType } from '../../modules/asset/types'
import { BrowseOptions } from '../../modules/routing/types'
import { View } from '../../modules/ui/types'
import { VendorName } from '../../modules/vendor'
import { Section } from '../../modules/vendor/routing/types'
import { LANDFilters } from '../Vendor/decentraland/types'
import { AssetFilter } from './utils'

export type Props = {
  minPrice: string
  maxPrice: string
  minEstateSize: string
  maxEstateSize: string
  rarities: Rarity[]
  network?: Network
  category?: NFTCategory
  bodyShapes?: (GenderFilterOption | WearableGender)[]
  isOnlySmart: boolean
  isOnSale?: boolean
  emotePlayMode?: EmotePlayMode[]
  assetType?: AssetType
  collection: string
  creators?: string[]
  section?: Section
  landStatus: LANDFilters
  values?: BrowseOptions
  vendor?: VendorName
  view?: View
  rentalDays?: number[]
  defaultCollapsed?: Record<AssetFilter, boolean>
  minDistanceToPlaza?: string
  maxDistanceToPlaza?: string
  adjacentToRoad?: boolean
  onBrowse: (options: BrowseOptions) => void
  onFilterChange?: (options: BrowseOptions) => void
  
  // feature flags
  isCreatorFiltersEnabled: boolean
  isPriceFilterEnabled: boolean
  isEstateSizeFilterEnabled: boolean
  isLocationFilterEnabled: boolean
  isRentalPeriodFilterEnabled: boolean
}

export type MapStateProps = Pick<
  Props,
  | 'minPrice'
  | 'maxPrice'
  | 'minEstateSize'
  | 'maxEstateSize'
  | 'rarities'
  | 'network'
  | 'category'
  | 'bodyShapes'
  | 'isOnlySmart'
  | 'isOnSale'
  | 'emotePlayMode'
  | 'assetType'
  | 'collection'
  | 'creators'
  | 'section'
  | 'landStatus'
  | 'vendor'
  | 'view'
  | 'rentalDays'
  | 'minDistanceToPlaza'
  | 'maxDistanceToPlaza'
  | 'adjacentToRoad'
  | 'isCreatorFiltersEnabled'
  | 'isPriceFilterEnabled'
  | 'isEstateSizeFilterEnabled'
  | 'isLocationFilterEnabled'
  | 'isRentalPeriodFilterEnabled'
>

export type OwnProps = Pick<Props, 'values' | 'onFilterChange'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
