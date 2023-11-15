import { Dispatch } from 'redux'
import { Order } from '@dcl/schemas'
import { OpenModalAction } from 'decentraland-dapps/dist/modules/modal/actions'
import { Asset, AssetType } from '../../../../modules/asset/types'
import {
  ExecuteOrderWithCardRequestAction,
  executeOrderWithCardRequest
} from '../../../../modules/order/actions'
import {
  BuyItemWithCardRequestAction,
  buyItemWithCardRequest
} from '../../../../modules/item/actions'

export type Props = {
  asset: Asset
  assetType: AssetType
  tokenId?: string
  buyWithCardClassName?: string
  isBuyCrossChainEnabled: boolean
  onBuyWithCrypto: (asset: Asset, order?: Order | null) => void
  onExecuteOrderWithCard: typeof executeOrderWithCardRequest
  onBuyItemWithCard: typeof buyItemWithCardRequest
}

export type MapStateProps = Pick<Props, 'isBuyCrossChainEnabled'>

export type MapDispatchProps = Pick<
  Props,
  'onExecuteOrderWithCard' | 'onBuyItemWithCard' | 'onBuyWithCrypto'
>
export type MapDispatch = Dispatch<
  | ExecuteOrderWithCardRequestAction
  | BuyItemWithCardRequestAction
  | OpenModalAction
>
