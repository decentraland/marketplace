import {
  getIsFeatureEnabled,
  getLoading,
  hasLoadedInitialFlags,
  isCreditsFeatureEnabled
} from 'decentraland-dapps/dist/modules/features/selectors'
import { ApplicationName } from 'decentraland-dapps/dist/modules/features/types'
import { RootState } from '../reducer'
import { getWallet } from '../wallet/selectors'
import { FeatureName } from './types'

export const isLoadingFeatureFlags = (state: RootState) => {
  return getLoading(state)
}

export const getIsMaintenanceEnabled = (state: RootState) => {
  // As this is called by the routes component which is rendered when the user enters the application,
  // Features might have not yet been requested and will throw in that case.
  try {
    return getIsFeatureEnabled(state, ApplicationName.MARKETPLACE, FeatureName.MAINTENANCE)
  } catch (e) {
    return false
  }
}

export const getIsMarketplaceLaunchPopupEnabled = (state: RootState): boolean => {
  try {
    return getIsFeatureEnabled(state, ApplicationName.MARKETPLACE, FeatureName.LAUNCH_POPUP)
  } catch (e) {
    return false
  }
}

export const getIsCampaignHomepageBannerEnabled = (state: RootState) => {
  try {
    return getIsFeatureEnabled(state, ApplicationName.MARKETPLACE, FeatureName.CAMPAIGN_HOMEPAGE_BANNER)
  } catch (e) {
    return false
  }
}

export const getIsCampaignCollectiblesBannerEnabled = (state: RootState) => {
  try {
    return getIsFeatureEnabled(state, ApplicationName.MARKETPLACE, FeatureName.CAMPAIGN_COLLECTIBLES_BANNER)
  } catch (e) {
    return false
  }
}

export const getIsCampaignBrowserEnabled = (state: RootState) => {
  try {
    return getIsFeatureEnabled(state, ApplicationName.MARKETPLACE, FeatureName.CAMPAIGN_BROWSER)
  } catch (e) {
    return false
  }
}

export const getIsLandCrossChainEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(state, ApplicationName.MARKETPLACE, FeatureName.CROSS_CHAIN_LANDS)
  }
  return false
}

export const getIsCreditsEnabled = (state: RootState) => {
  const wallet = getWallet(state)
  if (!wallet) {
    return false
  }
  const isEnabled: boolean = isCreditsFeatureEnabled(state, wallet.address)
  return isEnabled
}

export const getIsCreditsSecondarySalesEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(state, ApplicationName.MARKETPLACE, FeatureName.CREDITS_SECONDARY_SALES)
  }
  return false
}

export const getIsUnityWearablePreviewEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(state, ApplicationName.DAPPS, FeatureName.UNITY_WEARABLE_PREVIEW)
  }
  return false
}
