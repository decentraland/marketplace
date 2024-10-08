import { Dispatch } from 'redux'
import { Order } from '@dcl/schemas'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { getContract } from '../../../modules/contract/selectors'
import { NFT } from '../../../modules/nft/types'
import {
  clearOrderErrors,
  ClearOrderErrorsAction,
  executeOrderRequest,
  ExecuteOrderRequestAction,
  executeOrderWithCardRequest,
  ExecuteOrderWithCardRequestAction
} from '../../../modules/order/actions'
import { Contract } from '../../../modules/vendor/services'

export type Props = {
  nft: NFT
  order: Order | null
  wallet: Wallet
  isLoading: boolean
  isOwner: boolean
  hasInsufficientMANA: boolean
  hasLowPrice: boolean
  isBuyWithCardPage: boolean
  isOffchainPublicNFTOrdersEnabled: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onExecuteOrder: typeof executeOrderRequest
  onExecuteOrderWithCard: typeof executeOrderWithCardRequest
  onClearOrderErrors: typeof clearOrderErrors
} & WithAuthorizedActionProps

export type MapStateProps = Pick<Props, 'isLoading' | 'getContract' | 'isBuyWithCardPage' | 'isOffchainPublicNFTOrdersEnabled'>
export type MapDispatchProps = Pick<Props, 'onExecuteOrder' | 'onExecuteOrderWithCard' | 'onClearOrderErrors'>
export type MapDispatch = Dispatch<ExecuteOrderRequestAction | ExecuteOrderWithCardRequestAction | ClearOrderErrorsAction>
