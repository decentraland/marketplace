import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Desktop, Header, TabletAndBelow } from 'decentraland-ui'
import { locations } from '../../../../modules/routing/locations'

import './CampaignHomepageBanner.css'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

const CampaignHomepageBanner: React.FC = () => {
  return (
    <div className="CampaignHomepageBanner">
      <div className='copy'>
        <Header>{t('holiday_season_campaign.banner.homepage.title')}</Header>
        <p>{t('holiday_season_campaign.banner.homepage.subtitle')}</p>
      </div>
      <Button primary as={Link} to={locations.campaign()}><Desktop>{t('holiday_season_campaign.banner.homepage.cta')}</Desktop><TabletAndBelow>{t('holiday_season_campaign.banner.homepage.cta_mobile')}</TabletAndBelow></Button>
    </div>
  )
}

export default CampaignHomepageBanner