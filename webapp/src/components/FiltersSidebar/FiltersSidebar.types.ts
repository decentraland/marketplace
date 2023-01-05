import { EmotePlayMode, GenderFilterOption, Network, NFTCategory, Rarity } from '@dcl/schemas'
import { AssetType } from '../../modules/asset/types'
import { BrowseOptions } from '../../modules/routing/types'
import { Section } from '../../modules/vendor/routing/types'
import { LANDFilters } from '../Vendor/decentraland/types'

export type Props = {
  minPrice: string
  maxPrice: string
  rarities: Rarity[]
  network?: Network
  category?: NFTCategory
  bodyShapes?: GenderFilterOption[]
  isOnlySmart: boolean
  isOnSale?: boolean
  emotePlayMode?: EmotePlayMode[]
  assetType?: AssetType
  collection: string
  section: Section
  landStatus: LANDFilters
  isRentalsEnabled: boolean
  onBrowse: (options: BrowseOptions) => void
}

export type MapStateProps = Pick<Props, 'minPrice'
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
  | 'isRentalsEnabled'
>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
