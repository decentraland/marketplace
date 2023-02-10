import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header } from 'decentraland-ui'
import './CampaignBrowserBanner.css'

const CampaignBrowserBanner: React.FC = () => {
  return (
    <div className="CampaignBrowserBanner">
      <div className="copy">
        <Header>{t('holiday_season_campaign.banner.campaign_browser.title')}</Header>
        <p>{t('holiday_season_campaign.banner.campaign_browser.subtitle')}</p>
      </div>
    </div>
  )
}

export default CampaignBrowserBanner
