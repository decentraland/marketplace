import React from 'react'
import { Dispatch } from 'redux'
import { Avatar, Item, Order, Rarity, Network } from '@dcl/schemas'
import { OpenModalAction, openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { FetchSmartWearableVideoHashRequestAction, fetchSmartWearableVideoHashRequest } from '../../modules/asset/actions'
import { Asset } from '../../modules/asset/types'
import { FetchItemRequestAction, fetchItemRequest } from '../../modules/item/actions'
import { setIsTryingOn, SetIsTryingOnAction } from '../../modules/ui/preview/actions'

export type Props = {
  asset: Asset
  avatar?: Avatar
  children?: React.ReactNode
  className?: string
  item: Item | null
  order?: Order
  showOrderListedTag?: boolean
  showUpdatedDateWarning?: boolean
  videoHash?: string
  wallet: Wallet | null
  withNavigation?: boolean
  zoom?: number
  isDraggable?: boolean
  isLoadingVideoHash?: boolean
  isSmall?: boolean
  isTryingOn: boolean
  isUnityWearablePreviewEnabled?: boolean
  hasBadges?: boolean
  hasFetchedVideoHash?: boolean
  hasPopup?: boolean
  onFetchItem: typeof fetchItemRequest
  onFetchSmartWearableVideoHash: typeof fetchSmartWearableVideoHashRequest
  onPlaySmartWearableVideoShowcase: (videoHash: string) => ReturnType<typeof openModal>
  onSetIsTryingOn: typeof setIsTryingOn
}

export type OwnProps = Pick<Props, 'showOrderListedTag' | 'asset'>

export type MapStateProps = Pick<
  Props,
  | 'avatar'
  | 'item'
  | 'order'
  | 'videoHash'
  | 'wallet'
  | 'isLoadingVideoHash'
  | 'isTryingOn'
  | 'isUnityWearablePreviewEnabled'
  | 'hasFetchedVideoHash'
>
export type MapDispatchProps = Pick<
  Props,
  'onFetchItem' | 'onFetchSmartWearableVideoHash' | 'onPlaySmartWearableVideoShowcase' | 'onSetIsTryingOn'
>
export type MapDispatch = Dispatch<
  FetchItemRequestAction | FetchSmartWearableVideoHashRequestAction | OpenModalAction | SetIsTryingOnAction
>

export type AvailableForMintPopupType = {
  price: string
  stock: number
  rarity: Rarity
  contractAddress: string
  itemId: string
  network: Network
}
