import React, { useEffect } from 'react'
import { ethers } from 'ethers'
import { Loader } from 'decentraland-ui'
import { View } from '../../../modules/ui/types'
import { Section } from '../../../modules/vendor/decentraland'
import { VendorName } from '../../../modules/vendor/types'
import { isVendor } from '../../../modules/vendor/utils'
import { AssetBrowse } from '../../AssetBrowse'
import CampaignBanner from '../../CampaignBanner'
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
    campaignItemIds,
    additionalCampaignTags,
    isCampaignBrowserEnabled,
    isFetchingEvent
  } = props
  const vendor = isVendor(props.vendor) ? props.vendor : VendorName.DECENTRALAND

  // Still fetched when the campaign names its items: the tag may also resolve collections, and the page has
  // to settle either way before it can tell "nothing tagged" from "not asked yet".
  useEffect(() => {
    if (campaignTag && !isFetchingEvent && Object.values(contracts).length === 0) {
      onFetchEventContracts(campaignTag, additionalCampaignTags ?? [])
    }
  }, [onFetchEventContracts, campaignTag, isFetchingEvent, contracts])

  const activeTab = NavigationTab.CAMPAIGN_BROWSER
  // When there are no contracts for the campaign, use the zero address which will end up showing no items
  const campaignContracts =
    campaignTag && contracts[campaignTag] && contracts[campaignTag].length > 0 ? contracts[campaignTag] : [ethers.constants.AddressZero]

  // A campaign that names its items one by one selects by those alone: the catalogue intersects `id` with
  // `contractAddress` rather than unioning them, so sending both returns nothing.
  const namesItems = campaignItemIds.length > 0
  // Without this the page renders its empty state for a campaign that selects only by item, because the
  // guard below used to ask for tagged COLLECTIONS and a curated event has none.
  const hasSomethingToShow = namesItems || Object.values(contracts).length > 0

  return isCampaignBrowserEnabled ? (
    <PageLayout activeTab={activeTab}>
      <div className="CampaignBrowserPage">
        {hasSomethingToShow && !isLoadingCampaign && !isFetchingEvent && campaignTag ? (
          <>
            <CampaignBanner id={MARKETPLACE_CAMPAIGN_COLLECTIBLES_BANNER_ID} />
            <AssetBrowse
              vendor={vendor}
              isFullscreen={Boolean(isFullscreen)}
              view={View.MARKET}
              section={section}
              sections={[Section.WEARABLES, Section.EMOTES]}
              {...(namesItems ? { ids: campaignItemIds } : { contracts: campaignContracts })}
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
