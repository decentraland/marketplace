import { Dispatch } from 'redux'
import { Order } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { NFT } from '../../../modules/nft/types'
import {
  executeOrderRequest,
  ExecuteOrderRequestAction,
  executeOrderWithCardRequest,
  ExecuteOrderWithCardRequestAction
} from '../../../modules/order/actions'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'
import { WithAuthorizedActionProps } from '../../HOC/withAuthorizedAction'

export type Props = {
  nft: NFT
  order: Order | null
  wallet: Wallet
  isLoading: boolean
  isOwner: boolean
  hasInsufficientMANA: boolean
  hasLowPrice: boolean
  isBuyWithCardPage: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onExecuteOrder: typeof executeOrderRequest
  onExecuteOrderWithCard: typeof executeOrderWithCardRequest
} & WithAuthorizedActionProps

export type MapStateProps = Pick<
  Props,
  'isLoading' | 'getContract' | 'isBuyWithCardPage'
>
export type MapDispatchProps = Pick<
  Props,
  'onExecuteOrder' | 'onExecuteOrderWithCard'
>
export type MapDispatch = Dispatch<
  ExecuteOrderRequestAction | ExecuteOrderWithCardRequestAction
>
