import { RootState } from '../reducer'
import {
  getState,
  getIsFeatureEnabled
} from 'decentraland-dapps/dist/modules/features/selectors'
import { ApplicationName } from 'decentraland-dapps/dist/modules/features/types'
import { FeatureName } from './types'

export const getRankingsFeatureVariant = (state: RootState) => {
  try {
    const features = getState(state)
    return features.data[ApplicationName.MARKETPLACE].variants[
      `${ApplicationName.MARKETPLACE}-${FeatureName.RANKINGS}`
    ]
  } catch (e) {
    return false
  }
}

export const getIsMaintenanceEnabled = (state: RootState) => {
  // As this is called by the routes component which is rendered when the user enters the application,
  // Features might have not yet been requested and will throw in that case.
  try {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.MAINTENANCE
    )
  } catch (e) {
    return false
  }
}
