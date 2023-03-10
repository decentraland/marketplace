import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Desktop, Header, TabletAndBelow } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../../modules/routing/locations'
import * as decentraland from '../../../../modules/vendor/decentraland'
import { VendorName } from '../../../../modules/vendor'
import { SortBy } from '../../../../modules/routing/types'
import { AssetType } from '../../../../modules/asset/types'

import './CampaignHomepageBanner.css'

const CampaignHomepageBanner: React.FC = () => {
  return (
    <div className="CampaignHomepageBanner">
      <div className="copy">
        <Header>{t('fashion_week_campaign.banner.homepage.title')}</Header>
        <p>{t('fashion_week_campaign.banner.homepage.subtitle')}</p>
      </div>
      <Button
        primary
        as={Link}
        to={locations.campaign({
          section: decentraland.Section.WEARABLES,
          vendor: VendorName.DECENTRALAND,
          page: 1,
          sortBy: SortBy.RECENTLY_LISTED,
          onlyOnSale: true,
          assetType: AssetType.ITEM
        })}
        className="browse-button"
      >
        <Desktop>{t('fashion_week_campaign.banner.homepage.cta')}</Desktop>
        <TabletAndBelow>
          {t('fashion_week_campaign.banner.homepage.cta_mobile')}
        </TabletAndBelow>
      </Button>
    </div>
  )
}

export default CampaignHomepageBanner
