import { Order } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { openBuyManaWithFiatModalRequest } from 'decentraland-dapps/dist/modules/gateway/actions'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import type { Route } from 'decentraland-transactions/crossChain'
import { Asset } from '../../../modules/asset/types'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'
import {
  buyItemRequest,
  buyItemWithCardRequest
} from '../../../modules/item/actions'
import {
  executeOrderRequest,
  executeOrderWithCardRequest
} from '../../../modules/order/actions'

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: { asset: Asset; order?: Order }
  wallet: Wallet | null
  isLoading: boolean
  isLoadingBuyCrossChain: boolean
  isBuyWithCardPage: boolean
  isSwitchingNetwork: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onSwitchNetwork: typeof switchNetworkRequest
  onBuyItem: typeof buyItemRequest
  onBuyItemWithCard: typeof buyItemWithCardRequest
  onBuyItemThroughProvider: (route: Route) => void
  onExecuteOrder: typeof executeOrderRequest
  onExecuteOrderWithCard: typeof executeOrderWithCardRequest
  onGetMana: typeof openBuyManaWithFiatModalRequest
} & WithAuthorizedActionProps

export type OwnProps = Pick<Props, 'metadata'>
export type MapStateProps = Pick<
  Props,
  | 'wallet'
  | 'getContract'
  | 'isLoading'
  | 'isLoadingBuyCrossChain'
  | 'isBuyWithCardPage'
  | 'isSwitchingNetwork'
>
export type MapDispatchProps = Pick<
  Props,
  | 'onGetMana'
  | 'onSwitchNetwork'
  | 'onBuyItemThroughProvider'
  | 'onBuyItem'
  | 'onExecuteOrder'
  | 'onExecuteOrderWithCard'
  | 'onBuyItemWithCard'
>
