import { Network } from '@dcl/schemas'

export type Props = {
  selectedCollection?: string
  selectedRarities: string[]
  selectedGenders: string[]
  selectedNetwork?: Network
  onCollectionsChange: (contract: string) => void
  onGendersChange: (options: string[]) => void
  onRaritiesChange: (options: string[]) => void
  onNetworkChange: (network: Network) => void
}
