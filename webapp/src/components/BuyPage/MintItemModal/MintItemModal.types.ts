import { Dispatch } from 'redux'
import { Item } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import {
  buyItemRequest,
  BuyItemRequestAction,
  buyItemWithCardRequest,
  BuyItemWithCardRequestAction,
  clearItemErrors,
  ClearItemErrorsAction
} from '../../../modules/item/actions'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'

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
  onClearItemErrors: typeof clearItemErrors
} & WithAuthorizedActionProps

export type MapStateProps = Pick<
  Props,
  'isLoading' | 'isBuyWithCardPage' | 'getContract'
>
export type MapDispatchProps = Pick<Props, 'onBuyItem' | 'onBuyItemWithCard' | 'onClearItemErrors'>
export type MapDispatch = Dispatch<
  BuyItemRequestAction | BuyItemWithCardRequestAction | ClearItemErrorsAction
>
