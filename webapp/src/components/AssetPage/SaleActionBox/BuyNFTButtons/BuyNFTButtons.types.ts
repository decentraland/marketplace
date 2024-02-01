import { Dispatch } from 'redux'
import { Order } from '@dcl/schemas'
import { OpenModalAction } from 'decentraland-dapps/dist/modules/modal/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { CallHistoryMethodAction } from 'connected-react-router'
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
  isBuyingWithCryptoModalOpen: boolean
  wallet: Wallet | null
  isConnecting: boolean
  onBuyWithCrypto: (asset: Asset, order?: Order | null) => void
  onExecuteOrderWithCard: typeof executeOrderWithCardRequest
  onBuyItemWithCard: typeof buyItemWithCardRequest
  onRedirect: (path: string) => void
}

export type MapStateProps = Pick<
  Props,
  'wallet' | 'isConnecting' | 'isBuyingWithCryptoModalOpen'
>

export type MapDispatchProps = Pick<
  Props,
  | 'onExecuteOrderWithCard'
  | 'onBuyItemWithCard'
  | 'onBuyWithCrypto'
  | 'onRedirect'
>
export type MapDispatch = Dispatch<
  | ExecuteOrderWithCardRequestAction
  | BuyItemWithCardRequestAction
  | OpenModalAction
  | CallHistoryMethodAction
>
