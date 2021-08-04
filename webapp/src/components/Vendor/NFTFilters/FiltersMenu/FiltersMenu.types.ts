import { Network } from '@dcl/schemas'
import { AssetType } from '../../../../modules/asset/types'

export type Props = {
  resultType: AssetType
  selectedCollection?: string
  selectedRarities: string[]
  selectedGenders: string[]
  selectedNetwork?: Network
  onCollectionsChange: (contract: string) => void
  onGendersChange: (options: string[]) => void
  onRaritiesChange: (options: string[]) => void
  onNetworkChange: (network: Network) => void
}
