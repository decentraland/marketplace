import { AtlasTile } from 'decentraland-ui'
import { NFT } from '../../../modules/nft/types'
import { browse } from '../../../modules/routing/actions'

export type Props = {
  onlyOnSale?: boolean
  onlyOnRent?: boolean
  showOwned?: boolean
  tiles: Record<string, AtlasTile>
  ownedLands: NFT[]
  onBrowse: ActionFunction<typeof browse>
}

export type ContainerProps = Omit<Props, 'onBrowse' | 'onlyOnSale' | 'onlyOnRent' | 'tiles' | 'ownedLands'>
