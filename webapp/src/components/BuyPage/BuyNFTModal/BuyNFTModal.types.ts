import { Dispatch } from 'redux'
import { Order } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { NFT } from '../../../modules/nft/types'
import {
  executeOrderRequest,
  ExecuteOrderRequestAction
} from '../../../modules/order/actions'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'
import { openModal, OpenModalAction } from '../../../modules/modal/actions'

export type Props = {
  nft: NFT
  order: Order | null
  wallet: Wallet
  authorizations: Authorization[]
  isLoading: boolean
  isOwner: boolean
  hasInsufficientMANA: boolean
  hasLowPrice: boolean
  isBuyNftsWithFiatEnabled: boolean
  isBuyWithCardPage: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onExecuteOrder: typeof executeOrderRequest
  onFirstTimeBuyingWithCard: () => ReturnType<typeof openModal>
}

export type MapStateProps = Pick<
  Props,
  | 'authorizations'
  | 'isLoading'
  | 'getContract'
  | 'isBuyNftsWithFiatEnabled'
  | 'isBuyWithCardPage'
>
export type MapDispatchProps = Pick<
  Props,
  'onExecuteOrder' | 'onFirstTimeBuyingWithCard'
>
export type MapDispatch = Dispatch<ExecuteOrderRequestAction | OpenModalAction>
