import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Order } from '@dcl/schemas'
import { NFT } from '../../../modules/nft/types'
import { createOrderRequest } from '../../../modules/order/actions'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'
import { WithAuthorizedActionProps } from '../../HOC/withAuthorizedAction'

export type Props = {
  nft: NFT
  order: Order | null
  wallet: Wallet | null
  isLoading: boolean
  isCreatingOrder: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onGoBack: () => void
  onCreateOrder: typeof createOrderRequest
} & WithAuthorizedActionProps
