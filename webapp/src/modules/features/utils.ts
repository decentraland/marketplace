import { race, select, take } from 'redux-saga/effects'
import {
  FETCH_APPLICATION_FEATURES_FAILURE,
  FETCH_APPLICATION_FEATURES_SUCCESS
} from 'decentraland-dapps/dist/modules/features/actions'
import { isLoadingFeatureFlags } from 'decentraland-dapps/dist/modules/features/selectors'

export function* waitForFeatureFlagsToBeLoaded() {
  const isFetchingFeatureFlags: boolean = yield select(isLoadingFeatureFlags)
  if (isFetchingFeatureFlags) {
    yield race({
      success: take(FETCH_APPLICATION_FEATURES_SUCCESS),
      failure: take(FETCH_APPLICATION_FEATURES_FAILURE)
    })
  }
}
