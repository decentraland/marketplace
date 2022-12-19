import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Desktop, Header, TabletAndBelow } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../../modules/routing/locations'

import './CampaignCollectiblesBanner.css'

const CampaignCollectiblesBanner: React.FC = () => {
  return (
    <div className="CampaignCollectiblesBanner">
      <div className='copy'>
        <Header>{t('holiday_season_campaign.banner.collectibles.title')}</Header>
        <p>{t('holiday_season_campaign.banner.collectibles.subtitle')}</p>
      </div>
      <Button primary as={Link} to={locations.campaign()}><Desktop>{t('holiday_season_campaign.banner.collectibles.cta')}</Desktop><TabletAndBelow>{t('holiday_season_campaign.banner.collectibles.cta_mobile')}</TabletAndBelow></Button>
    </div>
  )
}

export default CampaignCollectiblesBanner