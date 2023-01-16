import { Dispatch } from 'redux'
import { Item } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import {
  buyItemRequest,
  BuyItemRequestAction
} from '../../../modules/item/actions'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'

export type Props = {
  item: Item
  wallet: Wallet
  authorizations: Authorization[]
  isLoading: boolean
  isOwner: boolean
  hasInsufficientMANA: boolean
  hasLowPrice: boolean
  isBuyNftsWithFiatEnabled: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onBuyItem: typeof buyItemRequest
}

export type MapStateProps = Pick<
  Props,
  'authorizations' | 'isLoading' | 'isBuyNftsWithFiatEnabled' | 'getContract'
>
export type MapDispatchProps = Pick<Props, 'onBuyItem'>
export type MapDispatch = Dispatch<BuyItemRequestAction>
