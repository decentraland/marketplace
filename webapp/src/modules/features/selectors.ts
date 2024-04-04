import { getIsFeatureEnabled, getLoading, hasLoadedInitialFlags } from 'decentraland-dapps/dist/modules/features/selectors'
import { ApplicationName } from 'decentraland-dapps/dist/modules/features/types'
import { RootState } from '../reducer'
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

export const getIsCampaignCollectionsBannerEnabled = (state: RootState) => {
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

export const getIsSmartWearablesFTUEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(state, ApplicationName.MARKETPLACE, FeatureName.SMART_WEARABLES_FTU)
  }
  return false
}

export const getIsMarketplaceServerEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(state, ApplicationName.MARKETPLACE, FeatureName.MARKETPLACE_SERVER)
  }
  return false
}

export const getIsChainSelectorEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(state, ApplicationName.MARKETPLACE, FeatureName.CHAIN_SELECTOR)
  }
  return false
}

export const getIsLandCrossChainEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(state, ApplicationName.MARKETPLACE, FeatureName.CROSS_CHAIN_LANDS)
  }
  return false
}

export const getIsExoticRarityEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(state, ApplicationName.DAPPS, FeatureName.EXOTIC_RARITY)
  }
  return false
}
