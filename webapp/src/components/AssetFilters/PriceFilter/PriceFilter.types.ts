import {
  EmotePlayMode,
  GenderFilterOption,
  NFTCategory,
  Rarity,
  WearableGender
} from '@dcl/schemas'
import { Network } from '@dcl/schemas/dist/dapps/network'
import { AssetType } from '../../../modules/asset/types'

export type Props = {
  section: string
  category?: NFTCategory
  assetType?: AssetType
  minPrice: string
  maxPrice: string
  network?: Network
  rarities: Rarity[]
  bodyShapes?: (GenderFilterOption | WearableGender)[]
  emotePlayMode?: EmotePlayMode[]
  isOnlySmart: boolean
  onChange: (value: [string, string]) => void
  defaultCollapsed?: boolean
  collection?: string
}

export type MapStateProps = Pick<
  Props,
  | 'section'
  | 'category'
  | 'assetType'
  | 'rarities'
  | 'bodyShapes'
  | 'isOnlySmart'
  | 'emotePlayMode'
  | 'collection'
  | 'network'
>
