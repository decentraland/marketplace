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
import { AssetFilter } from './utilts'

export type Props = {
  minPrice: string
  maxPrice: string
  rarities: Rarity[]
  network?: Network
  category?: NFTCategory
  bodyShapes?: (GenderFilterOption | WearableGender)[]
  isOnlySmart: boolean
  isOnSale?: boolean
  emotePlayMode?: EmotePlayMode[]
  assetType?: AssetType
  collection: string
  section?: Section
  landStatus: LANDFilters
  values?: BrowseOptions
  vendor?: VendorName
  view?: View
  onBrowse: (options: BrowseOptions) => void
  onFilterChange?: (options: BrowseOptions) => void
  defaultCollapsed?: Record<AssetFilter, boolean>
  isPriceFilterEnabled: boolean
}

export type MapStateProps = Pick<
  Props,
  | 'minPrice'
  | 'maxPrice'
  | 'rarities'
  | 'network'
  | 'category'
  | 'bodyShapes'
  | 'isOnlySmart'
  | 'isOnSale'
  | 'emotePlayMode'
  | 'assetType'
  | 'collection'
  | 'section'
  | 'landStatus'
  | 'vendor'
  | 'view'
  | 'isPriceFilterEnabled'
>

export type OwnProps = Pick<Props, 'values' | 'onFilterChange'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
