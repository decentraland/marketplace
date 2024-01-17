import React from 'react'

import { isVendor } from '../../modules/vendor/utils'
import { VendorName } from '../../modules/vendor/types'
import { View } from '../../modules/ui/types'
import { Section } from '../../modules/vendor/decentraland'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { AssetBrowse } from '../AssetBrowse'
import { CampaignBanner } from '../Campaign/CampaignBanner'
import { CampaignCollectiblesBanner } from '../Campaign/banners/CampaignCollectiblesBanner'
import { Props } from './BrowsePage.types'

const BrowsePage = (props: Props) => {
  const { isFullscreen, section, isCampaignCollectiblesBannerEnabled, contracts } = props
  const vendor = isVendor(props.vendor) ? props.vendor : VendorName.DECENTRALAND

  const activeTab = NavigationTab.COLLECTIBLES

  return (
    <>
      <Navbar />
      <Navigation activeTab={activeTab} isFullscreen={isFullscreen} />
      {isCampaignCollectiblesBannerEnabled ? <CampaignBanner><CampaignCollectiblesBanner /></CampaignBanner> : null}
      <AssetBrowse
        vendor={vendor}
        isFullscreen={Boolean(isFullscreen)}
        view={View.MARKET}
        section={section}
        sections={[Section.WEARABLES, Section.EMOTES]}
        contracts={contracts}
      />
      <Footer isFullscreen={isFullscreen} />
    </>
  )
}

export default React.memo(BrowsePage)
