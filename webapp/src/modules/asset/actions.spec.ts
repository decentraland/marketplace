import { Network } from '@dcl/schemas'
import {
  fetchSmartWearableRequiredPermissionsFailure,
  fetchSmartWearableRequiredPermissionsRequest,
  fetchSmartWearableRequiredPermissionsSuccess,
  FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_FAILURE,
  FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_REQUEST,
  FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_SUCCESS,
  FETCH_SMART_WEARABLE_VIDEO_HASH_FAILURE,
  FETCH_SMART_WEARABLE_VIDEO_HASH_REQUEST,
  FETCH_SMART_WEARABLE_VIDEO_HASH_SUCCESS,
  fetchSmartWearableVideoHashFailure,
  fetchSmartWearableVideoHashRequest,
  fetchSmartWearableVideoHashSuccess,
  clearAssetError,
  CLEAR_ASSET_ERROR
} from './actions'
import { Asset } from './types'

const asset = {
  name: 'aName',
  contractAddress: 'anAddress',
  itemId: 'anItemId',
  price: '1500000000000000000000',
  network: Network.ETHEREUM
} as Asset

const anErrorMessage = 'An error'

describe('when creating the action to signal the start of the smart wearable required permissions request', () => {
  it('should return an object representing the action', () => {
    expect(fetchSmartWearableRequiredPermissionsRequest(asset)).toEqual({
      type: FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_REQUEST,
      meta: undefined,
      payload: { asset }
    })
  })
})

describe('when creating the action to signal a success in the smart wearable required permissions request', () => {
  const requiredPermissions = ['aPermission']

  it('should return an object representing the action', () => {
    expect(fetchSmartWearableRequiredPermissionsSuccess(asset, requiredPermissions)).toEqual({
      type: FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_SUCCESS,
      meta: undefined,
      payload: { asset, requiredPermissions }
    })
  })
})

describe('when creating the action to signal a failure smart wearable required permissions request', () => {
  it('should return an object representing the action', () => {
    expect(fetchSmartWearableRequiredPermissionsFailure(asset, anErrorMessage)).toEqual({
      type: FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_FAILURE,
      meta: undefined,
      payload: { asset, error: anErrorMessage }
    })
  })
})

describe('when creating the action to signal the start of the smart wearable video hash request', () => {
  it('should return an object representing the action', () => {
    expect(fetchSmartWearableVideoHashRequest(asset)).toEqual({
      type: FETCH_SMART_WEARABLE_VIDEO_HASH_REQUEST,
      meta: undefined,
      payload: { asset }
    })
  })
})

describe('when creating the action to signal a success in the smart wearable video hash request', () => {
  const videoHash = 'videoHash'

  it('should return an object representing the action', () => {
    expect(fetchSmartWearableVideoHashSuccess(asset, videoHash)).toEqual({
      type: FETCH_SMART_WEARABLE_VIDEO_HASH_SUCCESS,
      meta: undefined,
      payload: { asset, videoHash }
    })
  })
})

describe('when creating the action to signal a failure smart wearable video hash request', () => {
  it('should return an object representing the action', () => {
    expect(fetchSmartWearableVideoHashFailure(asset, anErrorMessage)).toEqual({
      type: FETCH_SMART_WEARABLE_VIDEO_HASH_FAILURE,
      meta: undefined,
      payload: { asset, error: anErrorMessage }
    })
  })
})

describe('when creating the action to signal the clearing of errors', () => {
  it('should return an object representing the action', () => {
    expect(clearAssetError()).toEqual({
      type: CLEAR_ASSET_ERROR,
      meta: undefined,
      payload: undefined
    })
  })
})
