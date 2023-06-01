import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Order } from '@dcl/schemas'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { NFT } from '../../../modules/nft/types'
import { clearOrderErrors, createOrderRequest } from '../../../modules/order/actions'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'

export type Props = {
  nft: NFT
  order: Order | null
  wallet: Wallet | null
  isLoading: boolean
  isCreatingOrder: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onGoBack: () => void
  onCreateOrder: typeof createOrderRequest
  onClearOrderErrors: typeof clearOrderErrors
} & WithAuthorizedActionProps
