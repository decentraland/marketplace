import { IPreviewController } from '@dcl/schemas'
import {
  SetIsTryingOnAction,
  SetEmotePlayingAction,
  SET_EMOTE_PLAYING,
  SET_IS_TRYING_ON,
  SET_WEARABLE_PREVIEW_CONTROLLER,
  SetWearablePreviewControllerAction,
  SET_UNITY_PRELOADER_STATUS,
  SetUnityPreloaderStatusAction
} from './actions'

export type PreviewState = {
  isTryingOn: boolean
  wearablePreviewController?: IPreviewController | null
  isPlayingEmote?: boolean
  unityPreloader: {
    isReady: boolean
    isLoading: boolean
  }
}

export const INITIAL_STATE: PreviewState = {
  isTryingOn: false,
  unityPreloader: {
    isReady: false,
    isLoading: false
  }
}

type PreviewReducerAction = SetIsTryingOnAction | SetEmotePlayingAction | SetWearablePreviewControllerAction | SetUnityPreloaderStatusAction

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
    case SET_UNITY_PRELOADER_STATUS: {
      return {
        ...state,
        unityPreloader: {
          isReady: action.payload.isReady,
          isLoading: action.payload.isLoading
        }
      }
    }
    default:
      return state
  }
}
