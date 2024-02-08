import { Item } from '@dcl/schemas'
import { INITIAL_STATE } from 'decentraland-dapps/dist/modules/features/reducer'
import {
  getIsFeatureEnabled,
  hasLoadedInitialFlags
} from 'decentraland-dapps/dist/modules/features/selectors'
import { ApplicationName } from 'decentraland-dapps/dist/modules/features/types'
import { RootState } from '../reducer'
import {
  getIsCampaignBrowserEnabled,
  getIsCampaignCollectionsBannerEnabled,
  getIsCampaignHomepageBannerEnabled,
  getIsEmotesV2FTUEnabled,
  getIsMaintenanceEnabled,
  getIsMarketplaceLaunchPopupEnabled,
  getIsSmartWearablesFTUEnabled,
  isLoadingFeatureFlags,
  getIsClaimingNamesWithFiatEnabled,
  getIsEnsAddressEnabled
} from './selectors'
import { FeatureName } from './types'

jest.mock('decentraland-dapps/dist/modules/features/selectors', () => {
  const originalModule = jest.requireActual(
    'decentraland-dapps/dist/modules/features/selectors'
  )

  return {
    __esModule: true,
    ...originalModule,
    getIsFeatureEnabled: jest.fn(),
    hasLoadedInitialFlags: jest.fn()
  }
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
  getIsFeatureEnabledMock = getIsFeatureEnabled as jest.MockedFunction<
    typeof getIsFeatureEnabled
  >
  hasLoadedInitialFlagsMock = hasLoadedInitialFlags as jest.MockedFunction<
    typeof hasLoadedInitialFlags
  >
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
    selector: getIsCampaignCollectionsBannerEnabled
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
        expect(getIsFeatureEnabledMock).toHaveBeenCalledWith(
          state,
          ApplicationName.MARKETPLACE,
          feature
        )
      })
    })

    describe('when the feature is not enabled', () => {
      beforeEach(() => {
        getIsFeatureEnabledMock.mockReturnValueOnce(false)
      })

      it('should return false', () => {
        const isEnabled = selector(state)

        expect(isEnabled).toBe(false)
        expect(getIsFeatureEnabledMock).toHaveBeenCalledWith(
          state,
          ApplicationName.MARKETPLACE,
          feature
        )
      })
    })

    describe('when the feature is enabled', () => {
      beforeEach(() => {
        getIsFeatureEnabledMock.mockReturnValueOnce(true)
      })

      it('should return true', () => {
        const isEnabled = selector(state)

        expect(isEnabled).toBe(true)
        expect(getIsFeatureEnabledMock).toHaveBeenCalledWith(
          state,
          ApplicationName.MARKETPLACE,
          feature
        )
      })
    })
  })
)

const waitForInitialLoadingSelectors = [
  {
    name: 'isSmartWearablesFTU',
    feature: FeatureName.SMART_WEARABLES_FTU,
    selector: getIsSmartWearablesFTUEnabled
  },
  {
    name: 'isEmotesV2FTU',
    feature: FeatureName.EMOTES_V2_FTU,
    selector: getIsEmotesV2FTUEnabled
  },
  {
    name: 'claim-name-with-fiat',
    feature: FeatureName.CLAIM_NAMES_WITH_FIAT,
    selector: getIsClaimingNamesWithFiatEnabled,
    applicationName: ApplicationName.MARKETPLACE
  },
  {
    name: 'ens-address',
    feature: FeatureName.ENS_ADDRESS,
    selector: getIsEnsAddressEnabled,
    applicationName: ApplicationName.DAPPS
  }
]

waitForInitialLoadingSelectors.forEach(
  ({ name, feature, applicationName, selector }) =>
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
            expect(getIsFeatureEnabledMock).toHaveBeenCalledWith(
              state,
              applicationName || ApplicationName.MARKETPLACE,
              feature
            )
          })
        })

        describe('when the feature is enabled', () => {
          beforeEach(() => {
            getIsFeatureEnabledMock.mockReturnValueOnce(true)
          })

          it('should return true', () => {
            const isEnabled = selector(state)

            expect(isEnabled).toBe(true)
            expect(getIsFeatureEnabledMock).toHaveBeenCalledWith(
              state,
              applicationName || ApplicationName.MARKETPLACE,
              feature
            )
          })
        })
      })
    })
)
