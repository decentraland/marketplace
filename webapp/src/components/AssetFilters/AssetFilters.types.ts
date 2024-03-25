import { EmotePlayMode, GenderFilterOption, Network, NFTCategory, Rarity, WearableGender } from '@dcl/schemas'
import { AssetType } from '../../modules/asset/types'
import { BrowseOptions } from '../../modules/routing/types'
import { View } from '../../modules/ui/types'
import { VendorName } from '../../modules/vendor'
import { Section } from '../../modules/vendor/routing/types'
import { AssetStatusFilter } from '../../utils/filters'
import { LANDFilters } from '../Vendor/decentraland/types'
import { AssetFilter } from './utils'

export type Props = {
  minPrice: string
  maxPrice: string
  minEstateSize: string
  maxEstateSize: string
  rarities: Rarity[]
  status?: AssetStatusFilter
  network?: Network
  category?: NFTCategory
  bodyShapes?: (GenderFilterOption | WearableGender)[]
  isOnlySmart?: boolean
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
  defaultCollapsed?: Partial<Record<AssetFilter, boolean>>
  minDistanceToPlaza?: string
  maxDistanceToPlaza?: string
  adjacentToRoad?: boolean
  emoteHasSound?: boolean
  emoteHasGeometry?: boolean
  onBrowse: (options: BrowseOptions) => void
  onFilterChange?: (options: BrowseOptions) => void
}

export type MapStateProps = Pick<
  Props,
  | 'minPrice'
  | 'maxPrice'
  | 'minEstateSize'
  | 'maxEstateSize'
  | 'rarities'
  | 'status'
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
  | 'emoteHasGeometry'
  | 'emoteHasSound'
>

export type OwnProps = Pick<Props, 'values' | 'onFilterChange'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
