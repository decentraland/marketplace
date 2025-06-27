import { IPreviewController } from '@dcl/schemas'
import { PortalWearablePreviewProps } from '../../../components/PortalWearablePreview/PortalWearablePreview.types'
import {
  SetIsTryingOnAction,
  SetEmotePlayingAction,
  SET_EMOTE_PLAYING,
  SET_IS_TRYING_ON,
  SET_WEARABLE_PREVIEW_CONTROLLER,
  SetWearablePreviewControllerAction,
  SET_PORTAL_PREVIEW_PROPS,
  SetPortalPreviewPropsAction
} from './actions'

export type PreviewState = {
  isTryingOn: boolean
  wearablePreviewController?: IPreviewController | null
  isPlayingEmote?: boolean
  portalPreviewProps: Partial<PortalWearablePreviewProps> | null
}

export const INITIAL_STATE: PreviewState = {
  isTryingOn: false,
  portalPreviewProps: null
}

type PreviewReducerAction = SetIsTryingOnAction | SetEmotePlayingAction | SetWearablePreviewControllerAction | SetPortalPreviewPropsAction

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
    case SET_PORTAL_PREVIEW_PROPS: {
      return {
        ...state,
        portalPreviewProps: action.payload.props === null ? null : { ...state.portalPreviewProps, ...action.payload.props }
      }
    }
    default:
      return state
  }
}
