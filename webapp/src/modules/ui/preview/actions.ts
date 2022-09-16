import { action } from 'typesafe-actions'
import { IPreviewController } from '@dcl/schemas'

export const SET_IS_TRYING_ON = 'Set is trying on'
export const setIsTryingOn = (value: boolean) =>
  action(SET_IS_TRYING_ON, { value })
export type SetIsTryingOnAction = ReturnType<typeof setIsTryingOn>

export const SET_EMOTE_PLAYING = 'Set emote playing'
export const SET_WEARABLE_PREVIEW_CONTROLLER = 'Set wearable preview controller'
export const setEmotePlaying = (isPlayingEmote: boolean) =>
  action(SET_EMOTE_PLAYING, { isPlayingEmote })
export const setWearablePreviewController = (
  controller: IPreviewController | null
) => action(SET_WEARABLE_PREVIEW_CONTROLLER, { controller })
export type SetEmotePlayingAction = ReturnType<typeof setEmotePlaying>
export type SetWearablePreviewControllerAction = ReturnType<
  typeof setWearablePreviewController
>
