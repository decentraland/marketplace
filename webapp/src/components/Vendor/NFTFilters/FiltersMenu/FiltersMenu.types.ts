import { EmotePlayMode } from '@dcl/schemas'
import { AssetType } from '../../../../modules/asset/types'
import { Contract } from '../../../../modules/vendor/services'

export type Props = {
  assetType: AssetType
  selectedCollection?: string
  selectedEmotePlayMode?: string
  contracts: Contract[]
  availableContracts?: string[]
  isOnlySmart?: boolean
  onCollectionsChange: (contract?: string) => void
  onEmotePlayModeChange?: (playMode: EmotePlayMode) => void
  onOnlySmartChange?: (onlySmart: boolean) => void
}
