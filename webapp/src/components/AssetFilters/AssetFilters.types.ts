import { EmoteOutcomeType, EmotePlayMode, GenderFilterOption, Network, NFTCategory, Rarity, WearableGender } from '@dcl/schemas'
import { AssetType } from '../../modules/asset/types'
import { browse } from '../../modules/routing/actions'
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
  onlyOnSale?: boolean
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
  emoteOutcomeType?: EmoteOutcomeType
  withCredits?: boolean
  onBrowse: ActionFunction<typeof browse>
  onFilterChange?: (options: BrowseOptions) => void
  isSocialEmotesEnabled?: boolean
}

export type ContainerProps = Pick<Props, 'values' | 'onFilterChange' | 'defaultCollapsed'>
