import { Dispatch } from 'redux'
import { Contract, Order } from '@dcl/schemas'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { getContract } from '../../../modules/contract/selectors'
import { NFT } from '../../../modules/nft/types'
import { cancelOrderRequest, CancelOrderRequestAction, createOrderRequest, CreateOrderRequestAction } from '../../../modules/order/actions'

export type Metadata = {
  nft: NFT
  order: Order | null
}

export type Props = Omit<ModalProps, 'metadata'> &
  WithAuthorizedActionProps & {
    wallet: Wallet | null
    metadata: Metadata
    error: string | null
    getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
    onCreateOrder: typeof createOrderRequest
    isCreatingOrder: boolean
    isOffchainPublicNFTOrdersEnabled: boolean
    onCancelOrder: typeof cancelOrderRequest
    isCancelling: boolean
  }

export type OwnProps = Pick<Props, 'metadata'>

export type MapStateProps = Pick<
  Props,
  'wallet' | 'isCreatingOrder' | 'error' | 'isCancelling' | 'isOffchainPublicNFTOrdersEnabled' | 'getContract'
>

export type MapDispatchProps = Pick<Props, 'onCancelOrder' | 'onCreateOrder'>

export type MapDispatch = Dispatch<CreateOrderRequestAction | CancelOrderRequestAction>
