import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { NFT } from '../../../modules/nft/types'
import { Order } from '../../../modules/order/types'
import { Authorizations } from '../../../modules/authorization/types'
import { placeBidRequest } from '../../../modules/bid/actions'

export type Props = {
  nft: NFT
  order: Order | null
  wallet: Wallet | null
  authorizations: Authorizations
  onNavigate: (path: string) => void
  onPlaceBid: typeof placeBidRequest
}
