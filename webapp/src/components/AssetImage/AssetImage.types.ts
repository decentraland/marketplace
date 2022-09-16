import { Dispatch } from 'redux'
import { Avatar } from '@dcl/schemas'
import { Item } from '@dcl/schemas'
import { NFT } from '../../modules/nft/types'
import {
  setIsTryingOn,
  SetIsTryingOnAction
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
  isTryingOn: boolean
  isPlayingEmote?: boolean
  onSetIsTryingOn: typeof setIsTryingOn
}

export enum ControlOptionAction {
  ZOOM_IN,
  ZOOM_OUT,
  PLAY_EMOTE,
  STOP_EMOTE
}

export type MapStateProps = Pick<
  Props,
  'avatar' | 'isTryingOn' | 'isPlayingEmote'
>
export type MapDispatchProps = Pick<Props, 'onSetIsTryingOn'>
export type MapDispatch = Dispatch<SetIsTryingOnAction>
