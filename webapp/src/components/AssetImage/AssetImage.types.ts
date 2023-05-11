import React from 'react'
import { Dispatch } from 'redux'
import { Avatar, IPreviewController, Item, Rarity } from '@dcl/schemas'
import {
  setIsTryingOn,
  SetIsTryingOnAction,
  setWearablePreviewController,
  SetWearablePreviewControllerAction
} from '../../modules/ui/preview/actions'
import { Asset } from '../../modules/asset/types'

export type Props = {
  asset: Asset
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
  children?: React.ReactNode
  hasBadges?: boolean
  item: Item | null
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
  'avatar' | 'wearableController' | 'isTryingOn' | 'isPlayingEmote' | 'item'
>
export type MapDispatchProps = Pick<
  Props,
  'onSetIsTryingOn' | 'onSetWearablePreviewController'
>
export type MapDispatch = Dispatch<
  SetIsTryingOnAction | SetWearablePreviewControllerAction
>

export type AvailableForMintPopupType = {
  price: string
  stock: number
  rarity: Rarity
  contractAddress: string
  itemId: string
  network: string
}
