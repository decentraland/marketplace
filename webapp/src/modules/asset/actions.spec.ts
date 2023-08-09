import { Network } from '@dcl/schemas'
import {
  fetchSmartWearableRequiredPermissionsFailure,
  fetchSmartWearableRequiredPermissionsRequest,
  fetchSmartWearableRequiredPermissionsSuccess,
  FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_FAILURE,
  FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_REQUEST,
  FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_SUCCESS
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
    expect(
      fetchSmartWearableRequiredPermissionsSuccess(asset, requiredPermissions)
    ).toEqual({
      type: FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_SUCCESS,
      meta: undefined,
      payload: { asset, requiredPermissions }
    })
  })
})

describe('when creating the action to signal a failure smart wearable required permissions request', () => {
  it('should return an object representing the action', () => {
    expect(
      fetchSmartWearableRequiredPermissionsFailure(asset, anErrorMessage)
    ).toEqual({
      type: FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_FAILURE,
      meta: undefined,
      payload: { asset, error: anErrorMessage }
    })
  })
})
