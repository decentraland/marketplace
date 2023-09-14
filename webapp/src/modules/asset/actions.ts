import { action } from 'typesafe-actions'
import { Asset } from './types'

// Fetch Smart Wearable Required Permissions
export const FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_REQUEST =
  '[Request] Fetch Smart Wearable Required Permissions'
export const FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_SUCCESS =
  '[Success] Fetch Smart Wearable Required Permissions'
export const FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_FAILURE =
  '[Failure] Fetch Smart Wearable Required Permissions'

export const fetchSmartWearableRequiredPermissionsRequest = (asset: Asset) =>
  action(FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_REQUEST, { asset })

export const fetchSmartWearableRequiredPermissionsSuccess = (
  asset: Asset,
  requiredPermissions: string[]
) =>
  action(FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_SUCCESS, {
    asset,
    requiredPermissions
  })

export const fetchSmartWearableRequiredPermissionsFailure = (
  asset: Asset,
  error: string
) => action(FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_FAILURE, { asset, error })

export type FetchSmartWearableRequiredPermissionsRequestAction = ReturnType<
  typeof fetchSmartWearableRequiredPermissionsRequest
>
export type FetchSmartWearableRequiredPermissionsSuccessAction = ReturnType<
  typeof fetchSmartWearableRequiredPermissionsSuccess
>
export type FetchSmartWearableRequiredPermissionsFailureAction = ReturnType<
  typeof fetchSmartWearableRequiredPermissionsFailure
>

// Fetch Video Hash
export const FETCH_SMART_WEARABLE_VIDEO_HASH_REQUEST =
  '[Request] Fetch Smart Wearable Video Hash'
export const FETCH_SMART_WEARABLE_VIDEO_HASH_SUCCESS =
  '[Success] Fetch Smart Wearable Video Hash'
export const FETCH_SMART_WEARABLE_VIDEO_HASH_FAILURE =
  '[Failure] Fetch Smart Wearable Video Hash'

export const fetchSmartWearableVideoHashRequest = (asset: Asset) =>
  action(FETCH_SMART_WEARABLE_VIDEO_HASH_REQUEST, { asset })

export const fetchSmartWearableVideoHashSuccess = (
  asset: Asset,
  videoHash: string | undefined
) =>
  action(FETCH_SMART_WEARABLE_VIDEO_HASH_SUCCESS, {
    asset,
    videoHash
  })

export const fetchSmartWearableVideoHashFailure = (
  asset: Asset,
  error: string
) => action(FETCH_SMART_WEARABLE_VIDEO_HASH_FAILURE, { asset, error })

export type FetchSmartWearableVideoHashRequestAction = ReturnType<
  typeof fetchSmartWearableVideoHashRequest
>
export type FetchSmartWearableVideoHashSuccessAction = ReturnType<
  typeof fetchSmartWearableVideoHashSuccess
>
export type FetchSmartWearableVideoHashFailureAction = ReturnType<
  typeof fetchSmartWearableVideoHashFailure
>
