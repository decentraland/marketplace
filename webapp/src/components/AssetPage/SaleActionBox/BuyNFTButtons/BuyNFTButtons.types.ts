import { Dispatch } from 'redux'
import { Order } from '@dcl/schemas'
import { CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'
import { OpenModalAction } from 'decentraland-dapps/dist/modules/modal/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Asset, AssetType } from '../../../../modules/asset/types'
import { BuyItemWithCardRequestAction, buyItemWithCardRequest } from '../../../../modules/item/actions'
import { ExecuteOrderWithCardRequestAction, executeOrderWithCardRequest } from '../../../../modules/order/actions'

export type Props = {
  asset: Asset
  assetType: AssetType
  tokenId?: string
  buyWithCardClassName?: string
  isBuyingWithCryptoModalOpen: boolean
  wallet: Wallet | null
  credits: CreditsResponse | null
  isConnecting: boolean
  isCreditsEnabled: boolean
  isCreditsSecondarySalesEnabled: boolean
  onBuyWithCrypto: (asset: Asset, order?: Order | null, useCredits?: boolean) => void
  onExecuteOrderWithCard: typeof executeOrderWithCardRequest
  onBuyItemWithCard: typeof buyItemWithCardRequest
  onUseCredits: (value: boolean) => void
}

export type OwnProps = Pick<Props, 'asset' | 'assetType' | 'tokenId' | 'buyWithCardClassName'>

export type MapStateProps = Pick<
  Props,
  'wallet' | 'isConnecting' | 'isBuyingWithCryptoModalOpen' | 'isCreditsEnabled' | 'isCreditsSecondarySalesEnabled' | 'credits'
>

export type MapDispatchProps = Pick<Props, 'onExecuteOrderWithCard' | 'onBuyItemWithCard' | 'onBuyWithCrypto'>
export type MapDispatch = Dispatch<ExecuteOrderWithCardRequestAction | BuyItemWithCardRequestAction | OpenModalAction>
