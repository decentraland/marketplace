import { EmotePlayMode } from '@dcl/schemas'
import { AssetType } from '../../../../modules/asset/types'

export type Props = {
  assetType: AssetType
  selectedCollection?: string
  selectedEmotePlayMode?: string
  isOnlySmart?: boolean
  isOnSale?: boolean
  onCollectionsChange: (contract?: string) => void
  onEmotePlayModeChange?: (playMode: EmotePlayMode) => void
  onOnlySmartChange?: (onlySmart: boolean) => void
}
