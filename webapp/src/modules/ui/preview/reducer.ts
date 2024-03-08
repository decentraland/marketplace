import { IPreviewController } from '@dcl/schemas'
import {
  SetIsTryingOnAction,
  SetEmotePlayingAction,
  SET_EMOTE_PLAYING,
  SET_IS_TRYING_ON,
  SET_WEARABLE_PREVIEW_CONTROLLER,
  SetWearablePreviewControllerAction
} from './actions'

export type PreviewState = {
  isTryingOn: boolean
  wearablePreviewController?: IPreviewController | null
  isPlayingEmote?: boolean
}

export const INITIAL_STATE: PreviewState = {
  isTryingOn: false
}

type PreviewReducerAction = SetIsTryingOnAction | SetEmotePlayingAction | SetWearablePreviewControllerAction

export function previewReducer(state = INITIAL_STATE, action: PreviewReducerAction): PreviewState {
  switch (action.type) {
    case SET_IS_TRYING_ON: {
      return {
        ...state,
        isTryingOn: action.payload.value
      }
    }
    case SET_WEARABLE_PREVIEW_CONTROLLER: {
      return {
        ...state,
        wearablePreviewController: action.payload.controller
      }
    }
    case SET_EMOTE_PLAYING: {
      return {
        ...state,
        isPlayingEmote: action.payload.isPlayingEmote
      }
    }
    default:
      return state
  }
}
