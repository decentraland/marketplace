import { NFT } from '../../../modules/nft/types'
import { Order } from '../../../modules/order/types'
import { Authorizations } from '../../../modules/authorization/types'
import { createOrderRequest } from '../../../modules/order/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

export type Props = {
  nft: NFT
  order: Order | null
  wallet: Wallet | null
  authorizations: Authorizations
  onNavigate: (path: string) => void
  onCreateOrder: typeof createOrderRequest
}
