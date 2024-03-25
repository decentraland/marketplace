import { select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { FETCH_APPLICATION_FEATURES_FAILURE, FETCH_APPLICATION_FEATURES_SUCCESS } from 'decentraland-dapps/dist/modules/features/actions'
import { isLoadingFeatureFlags } from 'decentraland-dapps/dist/modules/features/selectors'
import { waitForFeatureFlagsToBeLoaded } from './utils'

describe('waitForFeatureFlagsToBeLoaded Util', () => {
  it('should do nothing if feature flags are already loaded', () => {
    return expectSaga(waitForFeatureFlagsToBeLoaded)
      .provide([[select(isLoadingFeatureFlags), false]])
      .not.take(FETCH_APPLICATION_FEATURES_SUCCESS)
      .not.take(FETCH_APPLICATION_FEATURES_FAILURE)
      .run()
  })

  it('should wait for FETCH_APPLICATION_FEATURES_SUCCESS if feature flags are being fetched', () => {
    return expectSaga(waitForFeatureFlagsToBeLoaded)
      .provide([[select(isLoadingFeatureFlags), true]])
      .take(FETCH_APPLICATION_FEATURES_SUCCESS)
      .run()
  })

  it('should wait for FETCH_APPLICATION_FEATURES_FAILURE if feature flags are being fetched and there is an error', () => {
    return expectSaga(waitForFeatureFlagsToBeLoaded)
      .provide([[select(isLoadingFeatureFlags), true]])
      .take(FETCH_APPLICATION_FEATURES_FAILURE)
      .run()
  })
})
