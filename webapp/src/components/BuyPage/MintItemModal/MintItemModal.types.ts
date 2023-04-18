import { Dispatch } from 'redux'
import { Item } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import {
  buyItemRequest,
  BuyItemRequestAction,
  buyItemWithCardRequest,
  BuyItemWithCardRequestAction
} from '../../../modules/item/actions'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'
import { WithAuthorizedActionProps } from '../../HOC/withAuthorizedAction'

export type Props = {
  item: Item
  wallet: Wallet
  isLoading: boolean
  isOwner: boolean
  hasInsufficientMANA: boolean
  hasLowPrice: boolean
  isBuyWithCardPage: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onBuyItem: typeof buyItemRequest
  onBuyItemWithCard: typeof buyItemWithCardRequest
} & WithAuthorizedActionProps

export type MapStateProps = Pick<
  Props,
  'isLoading' | 'isBuyWithCardPage' | 'getContract'
>
export type MapDispatchProps = Pick<Props, 'onBuyItem' | 'onBuyItemWithCard'>
export type MapDispatch = Dispatch<
  BuyItemRequestAction | BuyItemWithCardRequestAction
>
