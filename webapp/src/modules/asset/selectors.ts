import { RootState } from '../reducer'
import {
  FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_REQUEST,
  FETCH_SMART_WEARABLE_VIDEO_HASH_REQUEST
} from './actions'

export const getState = (state: RootState) => state.asset
export const getData = (state: RootState) => getState(state).data
export const getError = (state: RootState) => getState(state).error
export const getLoading = (state: RootState) => getState(state).loading
export const getAssetData = (state: RootState, id: string) =>
  getData(state)[id] || {}

export const isFetchingRequiredPermissions = (state: RootState, id: string) =>
  getLoading(state).find(
    action =>
      action.type === FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_REQUEST &&
      action.payload.asset.id === id
  ) !== undefined

export const isFetchingVideoHash = (state: RootState, id: string) =>
  getLoading(state).find(
    action =>
      action.type === FETCH_SMART_WEARABLE_VIDEO_HASH_REQUEST &&
      action.payload.asset.id === id
  ) !== undefined

export const getRequiredPermissions = (state: RootState, id: string) =>
  getAssetData(state, id)?.requiredPermissions || []

export const getVideoHash = (state: RootState, id: string) =>
  getAssetData(state, id)?.videoHash || undefined
