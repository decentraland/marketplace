import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Order } from '@dcl/schemas'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { NFT } from '../../../modules/nft/types'
import { createOrderRequest } from '../../../modules/order/actions'

export type Props = {
  nft: NFT
  order: Order | null
  wallet: Wallet | null
  authorizations: Authorization[]
  isLoading: boolean
  isCreatingOrder: boolean
  isRentalsEnabled: boolean
  onNavigate: (path: string) => void
  onGoBack: () => void
  onCreateOrder: typeof createOrderRequest
}
