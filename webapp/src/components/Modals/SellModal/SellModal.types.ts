import { Order } from '@dcl/schemas'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { Dispatch } from 'redux'

import { getContract } from '../../../modules/contract/selectors'
import { NFT } from '../../../modules/nft/types'
import {
  createOrderRequest,
  CreateOrderRequestAction
} from '../../../modules/order/actions'
import { Contract } from '../../../modules/vendor/services'

export type Metadata = {
  nft: NFT
  order: Order | null
}

export type Props = Omit<ModalProps, 'metadata'> & {
  wallet: Wallet | null
  metadata: Metadata
  onSubmitTransaction: (addressOperator: string) => void
  isTransactionBeingConfirmed: boolean
  isSubmittingTransaction: boolean
  error: string | null
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onCreateOrder: typeof createOrderRequest
  authorizations: Authorization[]
}

export type OwnProps = Pick<Props, 'metadata'>

export type MapStateProps = Pick<
  Props,
  | 'authorizations'
  | 'wallet'
  | 'isTransactionBeingConfirmed'
  | 'isSubmittingTransaction'
  | 'error'
  | 'getContract'
>

export type MapDispatchProps = Pick<Props, 'onCreateOrder'>

export type MapDispatch = Dispatch<CreateOrderRequestAction>
