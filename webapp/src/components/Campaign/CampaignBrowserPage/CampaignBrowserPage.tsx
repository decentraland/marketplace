import React, { useEffect } from 'react'
import { ethers } from 'ethers'
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
    isCampaignBrowserEnabled,
    isFetchingEvent
  } = props
  const vendor = isVendor(props.vendor) ? props.vendor : VendorName.DECENTRALAND

  useEffect(() => {
    if (campaignTag && !isFetchingEvent && Object.values(contracts).length === 0) {
      console.log('Fetching event contracts', campaignTag, additionalCampaignTags)
      onFetchEventContracts(campaignTag, additionalCampaignTags ?? [])
    }
  }, [onFetchEventContracts, campaignTag, isFetchingEvent, contracts])

  const activeTab = NavigationTab.CAMPAIGN_BROWSER
  // When there are no contracts for the campaign, use the zero address which will end up showing no items
  const campaignContracts =
    campaignTag && contracts[campaignTag] && contracts[campaignTag].length > 0 ? contracts[campaignTag] : [ethers.constants.AddressZero]

  return isCampaignBrowserEnabled ? (
    <PageLayout activeTab={activeTab}>
      <div className="CampaignBrowserPage">
        {Object.values(contracts).length > 0 && !isLoadingCampaign && !isFetchingEvent && campaignTag ? (
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
              contracts={campaignContracts}
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
