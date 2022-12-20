import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Desktop, Header, TabletAndBelow } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../../modules/routing/locations'
import * as decentraland from '../../../../modules/vendor/decentraland'
import { VendorName } from '../../../../modules/vendor'
import { SortBy } from '../../../../modules/routing/types'
import { AssetType } from '../../../../modules/asset/types'

import './CampaignCollectiblesBanner.css'

const CampaignCollectiblesBanner: React.FC = () => {
  return (
    <div className="CampaignCollectiblesBanner">
      <div className='copy'>
        <Header>{t('holiday_season_campaign.banner.collectibles.title')}</Header>
        <p>{t('holiday_season_campaign.banner.collectibles.subtitle')}</p>
      </div>
      <Button primary as={Link} to={locations.campaign({
        section: decentraland.Section.WEARABLES,
        vendor: VendorName.DECENTRALAND,
        page: 1,
        sortBy: SortBy.RECENTLY_LISTED,
        onlyOnSale: true,
        assetType: AssetType.ITEM
      })}><Desktop>{t('holiday_season_campaign.banner.collectibles.cta')}</Desktop><TabletAndBelow>{t('holiday_season_campaign.banner.collectibles.cta_mobile')}</TabletAndBelow></Button>
    </div>
  )
}

export default CampaignCollectiblesBanner