import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_SUCCESS,
  FETCH_SMART_WEARABLE_VIDEO_HASH_SUCCESS,
  fetchSmartWearableRequiredPermissionsFailure,
  fetchSmartWearableRequiredPermissionsRequest,
  fetchSmartWearableRequiredPermissionsSuccess,
  fetchSmartWearableVideoHashFailure,
  fetchSmartWearableVideoHashRequest,
  fetchSmartWearableVideoHashSuccess
} from './actions'
import { INITIAL_STATE, assetReducer } from './reducer'
import { Asset } from './types'

const asset = {
  id: 'anId',
  itemId: 'anItemId',
  contractAddress: 'aContractAddress',
  price: '5000000000000000000',
  data: {
    wearable: {
      isSmart: true
    }
  }
} as Asset

const notSmartWearableAsset = {
  ...asset,
  data: {}
}

const anErrorMessage = 'An error'

const requestActions = [fetchSmartWearableRequiredPermissionsRequest(asset), fetchSmartWearableRequiredPermissionsRequest(asset)]

requestActions.forEach(action => {
  describe(`when reducing the "${action.type}" action`, () => {
    it('should return a state with the loading set', () => {
      const initialState = {
        ...INITIAL_STATE,
        loading: []
      }

      expect(assetReducer(initialState, action)).toEqual({
        ...INITIAL_STATE,
        loading: loadingReducer(initialState.loading, action)
      })
    })
  })
})

const requestAssetNotSWActions = [
  fetchSmartWearableRequiredPermissionsRequest(notSmartWearableAsset),
  fetchSmartWearableRequiredPermissionsRequest(notSmartWearableAsset)
]

requestAssetNotSWActions.forEach(action => {
  describe(`when reducing the ${action.type} action`, () => {
    describe('and the asset is not a smart wearable', () => {
      it('should return the previous state', () => {
        const initialState = {
          ...INITIAL_STATE,
          loading: []
        }

        expect(assetReducer(initialState, action)).toEqual({
          ...INITIAL_STATE,
          loading: []
        })
      })
    })
  })
})

const failureActions = [
  {
    request: fetchSmartWearableRequiredPermissionsRequest(asset),
    failure: fetchSmartWearableRequiredPermissionsFailure(asset, anErrorMessage)
  },
  {
    request: fetchSmartWearableVideoHashRequest(asset),
    failure: fetchSmartWearableVideoHashFailure(asset, anErrorMessage)
  }
]

failureActions.forEach(action => {
  describe(`when reducing the "${action.failure.type}" action`, () => {
    it('should return a state with the error set and the loading state cleared', () => {
      const initialState = {
        ...INITIAL_STATE,
        error: null,
        loading: loadingReducer([], action.request)
      }

      expect(assetReducer(initialState, action.failure)).toEqual({
        ...INITIAL_STATE,
        error: anErrorMessage,
        loading: []
      })
    })
  })
})

describe.each([
  [
    FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_SUCCESS,
    fetchSmartWearableRequiredPermissionsRequest(asset),
    fetchSmartWearableRequiredPermissionsSuccess(asset, []),
    { requiredPermissions: [] }
  ],
  [
    FETCH_SMART_WEARABLE_VIDEO_HASH_SUCCESS,
    fetchSmartWearableVideoHashRequest(asset),
    fetchSmartWearableVideoHashSuccess(asset, 'videoHash'),
    { videoHash: 'videoHash' }
  ]
])('when reducing the %s action', (_action, requestAction, successAction, expectedData) => {
  const initialState = {
    ...INITIAL_STATE,
    data: { anotherId: { requiredPermissions: [] } },
    loading: loadingReducer([], requestAction)
  }

  it('should return a state with the the loaded items with the fetched item and the loading state cleared', () => {
    expect(assetReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: { ...initialState.data, [asset.id]: expectedData }
    })
  })
})
