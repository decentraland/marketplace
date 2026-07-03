import {
  getFeatureVariant,
  getIsFeatureEnabled,
  getLoading,
  hasLoadedInitialFlags,
  isCreditsFeatureEnabled
} from 'decentraland-dapps/dist/modules/features/selectors'
import { ApplicationName } from 'decentraland-dapps/dist/modules/features/types'
import { CURATED_MARKETPLACE_ENABLED } from '../../demo/flags'
import { RootState } from '../reducer'
import { getWallet } from '../wallet/selectors'
import { FeatureName } from './types'

export type CrossChainNameProvider = 'axelar' | 'across'

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

export const getIsBidsOffChainEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(state, ApplicationName.MARKETPLACE, FeatureName.OFFCHAIN_BIDS)
  }
  return false
}

export const getIsOffchainPublicNFTOrdersEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(state, ApplicationName.MARKETPLACE, FeatureName.OFFCHAIN_PUBLIC_NFT_ORDERS)
  }
  return false
}

export const getIsOffchainPublicItemOrdersEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(state, ApplicationName.DAPPS, FeatureName.OFFCHAIN_PUBLIC_ITEM_ORDERS)
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
  // Demo (curated branch): always use the Unity previewer — the toon shader is
  // key to the demo and the remote feature flag may be off for this domain.
  if (CURATED_MARKETPLACE_ENABLED) {
    return true
  }
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(state, ApplicationName.DAPPS, FeatureName.UNITY_WEARABLE_PREVIEW)
  }
  return false
}

export const getIsSocialEmotesEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(state, ApplicationName.DAPPS, FeatureName.SOCIAL_EMOTES)
  }
  return false
}

export const getIsNAMEsWithCreditsEnabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(state, ApplicationName.MARKETPLACE, FeatureName.NAMES_WITH_CREDITS)
  }
  return false
}

/**
 * Reads which cross-chain bridge provider should be used for the name-claim flow.
 * The `names-with-credits` feature flag supports two variants:
 *   - payload.value === 'across'  → Across V4 (SpokePoolPeriphery + MulticallHandler)
 *   - payload.value === 'axelar'  → Axelar/Squid/CORAL (legacy default)
 * If no variant is configured or it's not recognised, defaults to 'axelar'
 * so we don't accidentally route traffic to an unintended path.
 */
export const getCrossChainNameProvider = (state: RootState): CrossChainNameProvider => {
  try {
    const variant = getFeatureVariant(state, ApplicationName.MARKETPLACE, FeatureName.NAMES_WITH_CREDITS)
    const value = variant?.payload?.value?.toLowerCase()
    if (value === 'across') return 'across'
    return 'axelar'
  } catch (e) {
    return 'axelar'
  }
}
