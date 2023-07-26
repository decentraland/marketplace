import React from 'react'
import { Dispatch } from 'redux'
import { Avatar, IPreviewController, Item, Order, Rarity } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import {
  setIsTryingOn,
  SetIsTryingOnAction,
  setWearablePreviewController,
  SetWearablePreviewControllerAction
} from '../../modules/ui/preview/actions'
import { Asset } from '../../modules/asset/types'
import {
  FetchItemRequestAction,
  fetchItemRequest
} from '../../modules/item/actions'

export type Props = {
  asset: Asset
  order?: Order
  className?: string
  isDraggable?: boolean
  withNavigation?: boolean
  hasPopup?: boolean
  zoom?: number
  isSmall?: boolean
  showMonospace?: boolean
  avatar?: Avatar
  wearableController?: IPreviewController | null
  isTryingOn: boolean
  isPlayingEmote?: boolean
  showOrderListedTag?: boolean
  onSetIsTryingOn: typeof setIsTryingOn
  onSetWearablePreviewController: typeof setWearablePreviewController
  onFetchItem: typeof fetchItemRequest
  children?: React.ReactNode
  hasBadges?: boolean
  item: Item | null
  wallet: Wallet | null
}

export type OwnProps = Pick<Props, 'showOrderListedTag' | 'asset'>

export enum ControlOptionAction {
  ZOOM_IN,
  ZOOM_OUT,
  PLAY_EMOTE,
  STOP_EMOTE
}

export type MapStateProps = Pick<
  Props,
  | 'order'
  | 'avatar'
  | 'wearableController'
  | 'isTryingOn'
  | 'isPlayingEmote'
  | 'item'
  | 'wallet'
>
export type MapDispatchProps = Pick<
  Props,
  'onSetIsTryingOn' | 'onSetWearablePreviewController' | 'onFetchItem'
>
export type MapDispatch = Dispatch<
  | SetIsTryingOnAction
  | SetWearablePreviewControllerAction
  | FetchItemRequestAction
>

export type AvailableForMintPopupType = {
  price: string
  stock: number
  rarity: Rarity
  contractAddress: string
  itemId: string
  network: string
}
