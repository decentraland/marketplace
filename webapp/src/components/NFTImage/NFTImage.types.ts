import { NFT } from '../../modules/nft/types'

export type Props = {
  nft: NFT
  className?: string
  isDraggable?: boolean
  withNavigation?: boolean
  hasPopup?: boolean
  zoom?: number
  isSmall?: boolean
  showMonospace?: boolean
}
