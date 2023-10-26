import { Order } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { Asset } from '../../../modules/asset/types'
import { Route } from '../../../lib/xchain'
import {
  buyItemRequest,
  buyItemWithCardRequest
} from '../../../modules/item/actions'
import { getContract } from '../../../modules/contract/selectors'
import { Contract } from '../../../modules/vendor/services'
import {
  executeOrderRequest,
  executeOrderWithCardRequest
} from '../../../modules/order/actions'

export type Props = {
  asset: Asset
  order: Order | null
  wallet: Wallet | null
  isLoading: boolean
  isBuyWithCardPage: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onSwitchNetwork: typeof switchNetworkRequest
  onBuyItem: typeof buyItemRequest
  onBuyItemWithCard: typeof buyItemWithCardRequest
  onBuyItemThroughProvider: (route: Route) => void
  onExecuteOrder: typeof executeOrderRequest
  onExecuteOrderWithCard: typeof executeOrderWithCardRequest
} & WithAuthorizedActionProps

export type OwnProps = Pick<Props, 'asset'>
export type MapStateProps = Pick<
  Props,
  'wallet' | 'order' | 'getContract' | 'isLoading' | 'isBuyWithCardPage'
>
export type MapDispatchProps = Pick<
  Props,
  | 'onSwitchNetwork'
  | 'onBuyItemThroughProvider'
  | 'onBuyItem'
  | 'onExecuteOrder'
  | 'onExecuteOrderWithCard'
  | 'onBuyItemWithCard'
>
