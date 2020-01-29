import { NFT } from '../../../modules/nft/types'
import { Order } from '../../../modules/order/types'
import { executeOrderRequest } from '../../../modules/order/actions'

export type Props = {
  nft: NFT
  order: Order | null
  onNavigate: (path: string) => void
  onExecuteOrder: typeof executeOrderRequest
  isOwner?: boolean
  notEnoughMana?: boolean
}
