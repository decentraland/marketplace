import { EmotePlayMode, Network } from '@dcl/schemas'
import { AssetType } from '../../../../modules/asset/types'

export type Props = {
  assetType: AssetType
  selectedCollection?: string
  selectedRarities: string[]
  selectedGenders?: string[]
  selectedNetwork?: Network
  selectedEmotePlayMode?: string
  isOnlySmart?: boolean
  isOnSale?: boolean
  onCollectionsChange: (contract?: string) => void
  onGendersChange?: (options: string[]) => void
  onRaritiesChange: (options: string[]) => void
  onNetworkChange?: (network: Network) => void
  onEmotePlayModeChange?: (playMode: EmotePlayMode) => void
  onOnlySmartChange?: (onlySmart: boolean) => void
}
