import { Item } from '@dcl/schemas'
import { NFT } from '../../modules/nft/types'

export type Props = {
  asset: NFT | Item
  className?: string
  isDraggable?: boolean
  withNavigation?: boolean
  hasPopup?: boolean
  zoom?: number
  isSmall?: boolean
  showMonospace?: boolean
}
