import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Order } from '@dcl/schemas'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { NFT } from '../../../modules/nft/types'
import { createOrderRequest } from '../../../modules/order/actions'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'

export type Props = {
  nft: NFT
  order: Order | null
  wallet: Wallet | null
  authorizations: Authorization[]
  isLoading: boolean
  isCreatingOrder: boolean
  isRentalsEnabled: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onNavigate: (path: string) => void
  onGoBack: () => void
  onCreateOrder: typeof createOrderRequest
}
