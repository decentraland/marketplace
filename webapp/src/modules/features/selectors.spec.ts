import { Item } from '@dcl/schemas'
import { INITIAL_STATE } from 'decentraland-dapps/dist/modules/features/reducer'
import { getFeatureVariant, getIsFeatureEnabled, hasLoadedInitialFlags } from 'decentraland-dapps/dist/modules/features/selectors'
import { ApplicationName } from 'decentraland-dapps/dist/modules/features/types'
import { RootState } from '../reducer'
import {
  getIsCampaignBrowserEnabled,
  getIsCampaignCollectiblesBannerEnabled,
  getIsCampaignHomepageBannerEnabled,
  getIsMaintenanceEnabled,
  getIsMarketplaceLaunchPopupEnabled,
  isLoadingFeatureFlags,
  getIsBidsOffChainEnabled,
  getIsOffchainPublicNFTOrdersEnabled,
  getIsOffchainPublicItemOrdersEnabled,
  getIsCreditsSecondarySalesEnabled,
  getIsUnityWearablePreviewEnabled,
  getIsSocialEmotesEnabled,
  getCampaignTheme,
  getIsCancelledOrdersBannerEnabled
} from './selectors'
import { FeatureName } from './types'

jest.mock('decentraland-dapps/dist/modules/features/selectors', () => {
  const originalModule = jest.requireActual('decentraland-dapps/dist/modules/features/selectors')

  return {
    __esModule: true,
    ...originalModule,
    getIsFeatureEnabled: jest.fn(),
    getFeatureVariant: jest.fn(),
    hasLoadedInitialFlags: jest.fn()
  } as unknown
})

let state: RootState
let getIsFeatureEnabledMock: jest.MockedFunction<typeof getIsFeatureEnabled>
let hasLoadedInitialFlagsMock: jest.MockedFunction<typeof hasLoadedInitialFlags>

beforeEach(() => {
  state = {
    features: {
      ...INITIAL_STATE,
      data: {
        anItemId: {} as Item
      },
      error: 'anError',
      loading: []
    }
  } as any
  getIsFeatureEnabledMock = getIsFeatureEnabled as jest.MockedFunction<typeof getIsFeatureEnabled>
  hasLoadedInitialFlagsMock = hasLoadedInitialFlags as jest.MockedFunction<typeof hasLoadedInitialFlags>
})

describe('when getting the loading state of the features state', () => {
  it('should return the loading state', () => {
    expect(isLoadingFeatureFlags(state)).toEqual(state.features.loading)
  })
})

const tryCatchSelectors = [
  {
    name: 'IsMaintenance',
    feature: FeatureName.MAINTENANCE,
    selector: getIsMaintenanceEnabled
  },
  {
    name: 'IsMarketplaceLaunchPopup',
    feature: FeatureName.LAUNCH_POPUP,
    selector: getIsMarketplaceLaunchPopupEnabled
  },
  {
    name: 'IsCampaignHomepageBanner',
    feature: FeatureName.CAMPAIGN_HOMEPAGE_BANNER,
    selector: getIsCampaignHomepageBannerEnabled
  },
  {
    name: 'IsCampaignCollectionsBanner',
    feature: FeatureName.CAMPAIGN_COLLECTIBLES_BANNER,
    selector: getIsCampaignCollectiblesBannerEnabled
  },
  {
    name: 'IsCampaignBrowser',
    feature: FeatureName.CAMPAIGN_BROWSER,
    selector: getIsCampaignBrowserEnabled
  }
]

tryCatchSelectors.forEach(({ name, feature, selector }) =>
  describe(`when getting if the ${name} feature flag is enabled`, () => {
    describe('when the isFeatureEnabled selector fails', () => {
      beforeEach(() => {
        getIsFeatureEnabledMock.mockImplementationOnce(() => {
          throw new Error()
        })
      })

      it('should return false', () => {
        const isEnabled = selector(state)

        expect(isEnabled).toBe(false)
        expect(getIsFeatureEnabledMock).toHaveBeenCalledWith(state, ApplicationName.MARKETPLACE, feature)
      })
    })

    describe('when the feature is not enabled', () => {
      beforeEach(() => {
        getIsFeatureEnabledMock.mockReturnValueOnce(false)
      })

      it('should return false', () => {
        const isEnabled = selector(state)

        expect(isEnabled).toBe(false)
        expect(getIsFeatureEnabledMock).toHaveBeenCalledWith(state, ApplicationName.MARKETPLACE, feature)
      })
    })

    describe('when the feature is enabled', () => {
      beforeEach(() => {
        getIsFeatureEnabledMock.mockReturnValueOnce(true)
      })

      it('should return true', () => {
        const isEnabled = selector(state)

        expect(isEnabled).toBe(true)
        expect(getIsFeatureEnabledMock).toHaveBeenCalledWith(state, ApplicationName.MARKETPLACE, feature)
      })
    })
  })
)

const waitForInitialLoadingSelectors = [
  {
    name: 'IsBidsOffChainEnabled',
    feature: FeatureName.OFFCHAIN_BIDS,
    selector: getIsBidsOffChainEnabled,
    applicationName: ApplicationName.MARKETPLACE
  },
  {
    name: 'IsOffchainPublicNFTOrdersEnabled',
    feature: FeatureName.OFFCHAIN_PUBLIC_NFT_ORDERS,
    selector: getIsOffchainPublicNFTOrdersEnabled,
    applicationName: ApplicationName.MARKETPLACE
  },
  {
    name: 'IsfOffchainPublicItemOrdersEnabled',
    feature: FeatureName.OFFCHAIN_PUBLIC_ITEM_ORDERS,
    selector: getIsOffchainPublicItemOrdersEnabled,
    applicationName: ApplicationName.DAPPS
  },
  {
    name: 'IsCreditsSecondarySalesEnabled',
    feature: FeatureName.CREDITS_SECONDARY_SALES,
    selector: getIsCreditsSecondarySalesEnabled,
    applicationName: ApplicationName.MARKETPLACE
  },
  {
    name: 'IsUnityWearablePreviewEnabled',
    feature: FeatureName.UNITY_WEARABLE_PREVIEW,
    selector: getIsUnityWearablePreviewEnabled,
    applicationName: ApplicationName.DAPPS
  },
  {
    name: 'IsSocialEmotePreviewEnabled',
    feature: FeatureName.SOCIAL_EMOTES,
    selector: getIsSocialEmotesEnabled,
    applicationName: ApplicationName.DAPPS
  },
  {
    name: 'IsCancelledOrdersBannerEnabled',
    feature: FeatureName.CANCELLED_ORDERS_BANNER,
    selector: getIsCancelledOrdersBannerEnabled,
    applicationName: ApplicationName.DAPPS
  }
]

waitForInitialLoadingSelectors.forEach(({ name, feature, applicationName, selector }) =>
  describe(`when getting if the ${name} feature flag is enabled`, () => {
    describe('when the initial flags have not been yet loaded', () => {
      beforeEach(() => {
        hasLoadedInitialFlagsMock.mockReturnValueOnce(false)
      })

      it('should return false', () => {
        const isEnabled = selector(state)

        expect(isEnabled).toBe(false)
      })
    })

    describe('when the initial flags have been loaded', () => {
      beforeEach(() => {
        hasLoadedInitialFlagsMock.mockReturnValueOnce(true)
      })

      describe('when the feature is not enabled', () => {
        beforeEach(() => {
          getIsFeatureEnabledMock.mockReturnValueOnce(false)
        })

        it('should return false', () => {
          const isEnabled = selector(state)

          expect(isEnabled).toBe(false)
          expect(getIsFeatureEnabledMock).toHaveBeenCalledWith(state, applicationName || ApplicationName.MARKETPLACE, feature)
        })
      })

      describe('when the feature is enabled', () => {
        beforeEach(() => {
          getIsFeatureEnabledMock.mockReturnValueOnce(true)
        })

        it('should return true', () => {
          const isEnabled = selector(state)

          expect(isEnabled).toBe(true)
          expect(getIsFeatureEnabledMock).toHaveBeenCalledWith(state, applicationName || ApplicationName.MARKETPLACE, feature)
        })
      })
    })
  })
)

describe('when getting the campaign theme', () => {
  let getFeatureVariantMock: jest.MockedFunction<typeof getFeatureVariant>

  const aVariantWith = (value: string) => ({ payload: { value } }) as ReturnType<typeof getFeatureVariant>

  beforeEach(() => {
    getFeatureVariantMock = getFeatureVariant as jest.MockedFunction<typeof getFeatureVariant>
    getFeatureVariantMock.mockReset()
  })

  describe('and the campaign browser is off', () => {
    beforeEach(() => {
      getIsFeatureEnabledMock.mockReturnValue(false)
      getFeatureVariantMock.mockReturnValue(aVariantWith('halloween'))
    })

    it('should return null, so a payload left behind cannot dress an event that was taken down', () => {
      expect(getCampaignTheme(state)).toBeNull()
    })
  })

  describe('and the campaign browser is on', () => {
    beforeEach(() => {
      getIsFeatureEnabledMock.mockReturnValue(true)
    })

    describe('and the variant names a theme this build has', () => {
      beforeEach(() => {
        getFeatureVariantMock.mockReturnValue(aVariantWith('halloween'))
      })

      it('should return it', () => {
        expect(getCampaignTheme(state)).toBe('halloween')
      })
    })

    describe('and the variant names no theme', () => {
      beforeEach(() => {
        getFeatureVariantMock.mockReturnValue(aVariantWith('none'))
      })

      it('should take the skin off while leaving the event itself running', () => {
        expect(getCampaignTheme(state)).toBeNull()
        expect(getIsCampaignBrowserEnabled(state)).toBe(true)
      })
    })

    describe('and there is no variant at all', () => {
      // `null` is what the real selector returns for an application that carries no variant; `undefined`
      // only happens when the application itself is missing from the store. Both reach this code.
      it.each([null, undefined])('should return null, which is how the flag has shipped every campaign so far', variant => {
        getFeatureVariantMock.mockReturnValue(variant as unknown as ReturnType<typeof getFeatureVariant>)

        expect(getCampaignTheme(state)).toBeNull()
      })
    })

    describe('and the flags have not loaded, so the lookup throws', () => {
      beforeEach(() => {
        getFeatureVariantMock.mockImplementation(() => {
          throw new Error('features not loaded')
        })
      })

      it('should return null rather than take the page down with it', () => {
        expect(getCampaignTheme(state)).toBeNull()
      })
    })
  })
})
