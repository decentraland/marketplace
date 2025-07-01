import { action } from 'typesafe-actions'
import { IPreviewController } from '@dcl/schemas'
import { PortalWearablePreviewProps } from '../../../components/PortalWearablePreview/PortalWearablePreview.types'

export const SET_IS_TRYING_ON = 'Set is trying on'
export const SET_WEARABLE_PREVIEW_CONTROLLER = 'Set wearable preview controller'
export const SET_EMOTE_PLAYING = 'Set emote playing'
export const SET_PORTAL_PREVIEW_PROPS = 'Set portal preview props'

export const setIsTryingOn = (value: boolean) => action(SET_IS_TRYING_ON, { value })
export const setWearablePreviewController = (controller: IPreviewController | null) =>
  action(SET_WEARABLE_PREVIEW_CONTROLLER, { controller })
export const setEmotePlaying = (isPlayingEmote: boolean) => action(SET_EMOTE_PLAYING, { isPlayingEmote })
export const setPortalPreviewProps = (props: Partial<PortalWearablePreviewProps> | null) => action(SET_PORTAL_PREVIEW_PROPS, { props })

export type SetIsTryingOnAction = ReturnType<typeof setIsTryingOn>
export type SetWearablePreviewControllerAction = ReturnType<typeof setWearablePreviewController>
export type SetEmotePlayingAction = ReturnType<typeof setEmotePlaying>
export type SetPortalPreviewPropsAction = ReturnType<typeof setPortalPreviewProps>
