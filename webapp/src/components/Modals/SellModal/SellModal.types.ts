import { Order } from '@dcl/schemas'
import { Dispatch } from 'redux'
import {
  fetchAuthorizationsRequest,
  FetchAuthorizationsRequestAction
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'

import {
  upsertContracts,
  UpsertContractsAction
} from '../../../modules/contract/actions'
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
  error: string | null
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onCreateOrder: typeof createOrderRequest
  authorizations: Authorization[]
  isCreatingOrder: boolean
  isAuthorizing: boolean
  onFetchAuthorizations: typeof fetchAuthorizationsRequest
  onUpsertContracts: typeof upsertContracts
}

export type OwnProps = Pick<Props, 'metadata'>

export type MapStateProps = Pick<
  Props,
  | 'authorizations'
  | 'wallet'
  | 'isCreatingOrder'
  | 'error'
  | 'getContract'
  | 'isAuthorizing'
>

export type MapDispatchProps = Pick<
  Props,
  'onCreateOrder' | 'onFetchAuthorizations' | 'onUpsertContracts'
>

export type MapDispatch = Dispatch<
  | CreateOrderRequestAction
  | FetchAuthorizationsRequestAction
  | UpsertContractsAction
>
