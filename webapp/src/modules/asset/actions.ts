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
