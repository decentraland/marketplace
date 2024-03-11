import { loadingReducer, LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FetchSmartWearableRequiredPermissionsFailureAction,
  FetchSmartWearableRequiredPermissionsRequestAction,
  FetchSmartWearableRequiredPermissionsSuccessAction,
  FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_FAILURE,
  FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_REQUEST,
  FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_SUCCESS,
  FETCH_SMART_WEARABLE_VIDEO_HASH_FAILURE,
  FETCH_SMART_WEARABLE_VIDEO_HASH_REQUEST,
  FETCH_SMART_WEARABLE_VIDEO_HASH_SUCCESS,
  FetchSmartWearableVideoHashFailureAction,
  FetchSmartWearableVideoHashRequestAction,
  FetchSmartWearableVideoHashSuccessAction
} from './actions'
import { AssetData } from './types'

export type AssetState = {
  data: AssetData
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: AssetState = {
  data: {},
  loading: [],
  error: null
}

type AssetReducerAction =
  | FetchSmartWearableRequiredPermissionsFailureAction
  | FetchSmartWearableVideoHashFailureAction
  | FetchSmartWearableRequiredPermissionsRequestAction
  | FetchSmartWearableVideoHashRequestAction
  | FetchSmartWearableRequiredPermissionsSuccessAction
  | FetchSmartWearableVideoHashSuccessAction

export function assetReducer(state = INITIAL_STATE, action: AssetReducerAction): AssetState {
  switch (action.type) {
    case FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_REQUEST:
    case FETCH_SMART_WEARABLE_VIDEO_HASH_REQUEST: {
      const { asset } = action.payload
      if (!asset.data.wearable?.isSmart) return state

      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }

    case FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_SUCCESS: {
      const { asset, requiredPermissions } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          [asset.id]: { ...state.data[asset.id], requiredPermissions }
        },
        error: null
      }
    }

    case FETCH_SMART_WEARABLE_VIDEO_HASH_SUCCESS: {
      const { asset, videoHash } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          [asset.id]: { ...state.data[asset.id], videoHash }
        },
        error: null
      }
    }

    case FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_FAILURE:
    case FETCH_SMART_WEARABLE_VIDEO_HASH_FAILURE: {
      const { error } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error
      }
    }

    default:
      return state
  }
}
