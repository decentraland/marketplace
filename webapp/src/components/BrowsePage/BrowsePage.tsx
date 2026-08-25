import React from 'react'
import { Banner } from 'decentraland-dapps/dist/containers/Banner'
import { View } from '../../modules/ui/types'
import { Section } from '../../modules/vendor/decentraland'
import { VendorName } from '../../modules/vendor/types'
import { isVendor } from '../../modules/vendor/utils'
import { AssetBrowse } from '../AssetBrowse'
import { NavigationTab } from '../Navigation/Navigation.types'
import { PageLayout } from '../PageLayout'
import { Props } from './BrowsePage.types'
import styles from './BrowsePage.module.css'

const MARKETPLACE_COLLECTIBLES_BANNER_ID = 'marketplaceCollectiblesBanner'

const BrowsePage = (props: Props) => {
  const { isFullscreen, section, isCampaignCollectiblesBannerEnabled, contracts } = props
  const vendor = isVendor(props.vendor) ? props.vendor : VendorName.DECENTRALAND

  const activeTab = NavigationTab.COLLECTIBLES

  return (
    <PageLayout activeTab={activeTab}>
      {isCampaignCollectiblesBannerEnabled ? (
        <div className={styles.banner}>
          <Banner id={MARKETPLACE_COLLECTIBLES_BANNER_ID} />
        </div>
      ) : null}
      <AssetBrowse
        vendor={vendor}
        isFullscreen={Boolean(isFullscreen)}
        view={View.MARKET}
        section={section}
        sections={[Section.WEARABLES, Section.EMOTES]}
        contracts={contracts}
      />
    </PageLayout>
  )
}

export default React.memo(BrowsePage)
