import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { NFT } from '../../../modules/nft/types'
import { placeBidRequest } from '../../../modules/bid/actions'

export type Props = {
  nft: NFT
  wallet: Wallet | null
  authorizations: Authorization[]
  onNavigate: (path: string) => void
  onPlaceBid: typeof placeBidRequest
  isPlacingBid: boolean
}
