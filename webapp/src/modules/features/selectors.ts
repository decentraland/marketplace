import { RootState } from '../reducer'
import {
  getIsFeatureEnabled,
  getLoading
} from 'decentraland-dapps/dist/modules/features/selectors'
import { ApplicationName } from 'decentraland-dapps/dist/modules/features/types'
import { FeatureName } from './types'

export const isLoadingFeatureFlags = (state: RootState) => {
  return getLoading(state)
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

export const getIsCampaignHomepageBannerEnabled = (state: RootState) => {
  try {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.CAMPAIGN_HOMEPAGE_BANNER
    )
  } catch (e) {
    return false
  }
}

export const getIsCampaignCollectionsBannerEnabled = (state: RootState) => {
  try {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.CAMPAIGN_COLLECTIBLES_BANNER
    )
  } catch (e) {
    return false
  }
}

export const getIsCampaignBrowserEnabled = (state: RootState) => {
  try {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.CAMPAIGN_BROWSER
    )
  } catch (e) {
    return false
  }
}
