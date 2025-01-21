import React, { useEffect } from 'react'
import { Banner } from 'decentraland-dapps/dist/containers/Banner'
import { Loader } from 'decentraland-ui'
import { View } from '../../../modules/ui/types'
import { Section } from '../../../modules/vendor/decentraland'
import { VendorName } from '../../../modules/vendor/types'
import { isVendor } from '../../../modules/vendor/utils'
import { AssetBrowse } from '../../AssetBrowse'
import { NavigationTab } from '../../Navigation/Navigation.types'
import { PageLayout } from '../../PageLayout'
import { Props } from './CampaignBrowserPage.types'
import './CampaignBrowserPage.css'

const MARKETPLACE_CAMPAIGN_COLLECTIBLES_BANNER_ID = 'marketplaceCampaignCollectiblesBanner'

const CampaignBrowserPage = (props: Props) => {
  const {
    isFullscreen,
    section,
    contracts,
    onFetchEventContracts,
    isLoadingCampaign,
    campaignTag,
    additionalCampaignTags,
    isCampaignBrowserEnabled
  } = props
  const vendor = isVendor(props.vendor) ? props.vendor : VendorName.DECENTRALAND

  useEffect(() => {
    if (campaignTag) {
      console.log('Fetching event contracts')
      onFetchEventContracts(campaignTag, additionalCampaignTags ?? [])
    }
  }, [onFetchEventContracts, campaignTag])

  const activeTab = NavigationTab.CAMPAIGN_BROWSER

  return isCampaignBrowserEnabled ? (
    <PageLayout activeTab={activeTab}>
      <div className="CampaignBrowserPage">
        {Object.values(contracts).length > 0 && !isLoadingCampaign && campaignTag ? (
          <>
            <div className="banner">
              <Banner id={MARKETPLACE_CAMPAIGN_COLLECTIBLES_BANNER_ID} />
            </div>
            <AssetBrowse
              vendor={vendor}
              isFullscreen={Boolean(isFullscreen)}
              view={View.MARKET}
              section={section}
              sections={[Section.WEARABLES, Section.EMOTES]}
              contracts={contracts[campaignTag]}
            />
          </>
        ) : (
          <div className="empty">
            <Loader size="big" active inline />
          </div>
        )}
      </div>
    </PageLayout>
  ) : null
}

export default React.memo(CampaignBrowserPage)
