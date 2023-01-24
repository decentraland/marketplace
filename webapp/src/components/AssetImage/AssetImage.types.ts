import React from 'react'
import { Dispatch } from 'redux'
import { Avatar, IPreviewController } from '@dcl/schemas'
import { Item } from '@dcl/schemas'
import { NFT } from '../../modules/nft/types'
import {
  setIsTryingOn,
  SetIsTryingOnAction,
  setWearablePreviewController,
  SetWearablePreviewControllerAction
} from '../../modules/ui/preview/actions'

export type Props = {
  asset: NFT | Item
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
}

export type OwnProps = Pick<Props, 'showOrderListedTag'>

export enum ControlOptionAction {
  ZOOM_IN,
  ZOOM_OUT,
  PLAY_EMOTE,
  STOP_EMOTE
}

export type MapStateProps = Pick<
  Props,
  'avatar' | 'wearableController' | 'isTryingOn' | 'isPlayingEmote'
>
export type MapDispatchProps = Pick<
  Props,
  'onSetIsTryingOn' | 'onSetWearablePreviewController'
>
export type MapDispatch = Dispatch<
  SetIsTryingOnAction | SetWearablePreviewControllerAction
>
