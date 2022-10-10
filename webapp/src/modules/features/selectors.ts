import { RootState } from '../reducer'
import { getIsFeatureEnabled } from 'decentraland-dapps/dist/modules/features/selectors'
import { ApplicationName } from 'decentraland-dapps/dist/modules/features/types'
import { FeatureName } from './types'

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

export const getIsRentalsEnabled = (state: RootState) => {
  try {
    return getIsFeatureEnabled(
      state,
      ApplicationName.BUILDER,
      FeatureName.RENTALS
    )
  } catch (e) {
    return false
  }
}

export const getIsMVMFEnabled = (state: RootState) => {
  try {
    return getIsFeatureEnabled(
      state,
      ApplicationName.BUILDER,
      FeatureName.MVMF
    )
  } catch (e) {
    return false
  }
}

export const getIsMVMFAnnouncementEnabled = (state: RootState) => {
  try {
    return getIsFeatureEnabled(
      state,
      ApplicationName.BUILDER,
      FeatureName.MVMF_ANNOUNCEMENT
    )
  } catch (e) {
    return false
  }
}
