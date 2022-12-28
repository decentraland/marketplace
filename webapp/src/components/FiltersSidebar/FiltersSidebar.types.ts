import { EmotePlayMode, Network, NFTCategory, Rarity, WearableGender } from '@dcl/schemas'
import { BrowseOptions } from '../../modules/routing/types'

export type Props = {
  minPrice: string
  maxPrice: string
  rarities: Rarity[]
  network?: Network
  category?: NFTCategory
  bodyShapes?: WearableGender[]
  isOnlySmart: boolean
  isOnSale?: boolean
  emotePlayMode?: EmotePlayMode
  onBrowse: (options: BrowseOptions) => void
}

export type MapStateProps = Pick<Props, 'minPrice' | 'maxPrice' | 'rarities' | 'network' | 'category' | 'bodyShapes' | 'isOnlySmart' | 'isOnSale' | 'emotePlayMode'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
