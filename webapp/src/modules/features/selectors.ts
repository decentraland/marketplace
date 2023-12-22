import { RootState } from '../reducer'
import {
  getIsFeatureEnabled,
  getLoading,
  hasLoadedInitialFlags
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

export const getIsMarketplaceLaunchPopupEnabled = (
  state: RootState
): boolean => {
  try {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.LAUNCH_POPUP
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

export const getIsPriceFilterEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.PRICE_FILTER
    )
  }
  return false
}

export const getIsEstateSizeFilterEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.ESTATE_SIZE_FILTER
    )
  }
  return false
}

export const getIsCreatorsFilterEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.CREATOR_FILTER
    )
  }
  return false
}

export const getIsLocationFilterEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.LOCATION_FILTER
    )
  }
  return false
}

export const getIsRentalPeriodFilterEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.RENTAL_PERIOD_FILTER
    )
  }
  return false
}

export const getIsMapViewFiltersEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.MAP_VIEW_FILTERS
    )
  }
  return false
}

export const getIsRentalPriceFilterChartEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.RENTAL_PRICE_FILTER_CHART
    )
  }
  return false
}

export const getIsHandsCategoryEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.HANDS_CATEGORY
    )
  }
  return false
}

export const getIsSmartWearablesFTUEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.SMART_WEARABLES_FTU
    )
  }
  return false
}

export const getIsEmotesV2Enabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.EMOTES_V2
    )
  }
  return false
}

export const getIsEmotesV2FTUEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.EMOTES_V2_FTU
    )
  }
  return false
}

export const getIsNewNavbarDropdownEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.NEW_NAVBAR_DROPDOWN
    )
  }
  return false
}
export const getIsMarketplaceServerEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.MARKETPLACE_SERVER
    )
  }
  return false
}

export const getIsBuyCrossChainEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(
      state,
      ApplicationName.MARKETPLACE,
      FeatureName.BUY_CROSS_CHAIN
    )
  }
  return false
}

export const getIsAuthDappEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(
      state,
      ApplicationName.DAPPS,
      FeatureName.AUTH_DAPP
    )
  }
  return false
}
