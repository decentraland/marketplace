import { NFT } from '../../modules/nft/types'

export type Props = {
  nft: NFT
  className?: string
  isDraggable?: boolean
  withNavigation?: boolean
  zoom?: number
}
