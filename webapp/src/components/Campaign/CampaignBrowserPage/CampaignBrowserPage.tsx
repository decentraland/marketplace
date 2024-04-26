import React, { useEffect } from 'react'
import { Loader } from 'decentraland-ui'
import { View } from '../../../modules/ui/types'
import { Section } from '../../../modules/vendor/decentraland'
import { VendorName } from '../../../modules/vendor/types'
import { isVendor } from '../../../modules/vendor/utils'
import { AssetBrowse } from '../../AssetBrowse'
import { NavigationTab } from '../../Navigation/Navigation.types'
import { PageLayout } from '../../PageLayout'
import { CampaignBrowserBanner } from '../banners/CampaignBrowserBanner'
import { CampaignBanner } from '../CampaignBanner'
import { ADDITIONAL_CAMPAIGN_BROWSE_TAGS, CAMPAIGN_TAG } from '../config'
import { Props } from './CampaignBrowserPage.types'
import './CampaignBrowserPage.css'

const CampaignBrowserPage = (props: Props) => {
  const { isFullscreen, section, contracts, onFetchEventContracts, isCampaignBrowserEnabled } = props
  const vendor = isVendor(props.vendor) ? props.vendor : VendorName.DECENTRALAND

  useEffect(() => {
    onFetchEventContracts(CAMPAIGN_TAG, ADDITIONAL_CAMPAIGN_BROWSE_TAGS)
  }, [onFetchEventContracts])

  const activeTab = NavigationTab.CAMPAIGN_BROWSER

  return isCampaignBrowserEnabled ? (
    <PageLayout activeTab={activeTab}>
      {Object.values(contracts).length > 0 ? (
        <>
          <CampaignBanner>
            <CampaignBrowserBanner />
          </CampaignBanner>
          <AssetBrowse
            vendor={vendor}
            isFullscreen={Boolean(isFullscreen)}
            view={View.MARKET}
            section={section}
            sections={[Section.WEARABLES, Section.EMOTES]}
            contracts={contracts[CAMPAIGN_TAG]}
          />
        </>
      ) : (
        <div className="CampaignBrowserPage">
          <Loader size="big" active inline />
        </div>
      )}
    </PageLayout>
  ) : null
}

export default React.memo(CampaignBrowserPage)
