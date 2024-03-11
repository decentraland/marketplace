import React from 'react'
import { Header, Mobile } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import logo from '../logo.png'
import wearableIcon from '../wearables.png'
import './CampaignBrowserBanner.css'

const CampaignBrowserBanner: React.FC = () => {
  return (
    <div className="CampaignBrowserBanner">
      <div className="banner-container">
        <img src={logo} alt={t('campaign.event_hashtag')} className="event-banner-logo" />
        <div className="copy">
          <Header>{t('event_campaign.campaign_browser.title')}</Header>
          <p>
            {t('event_campaign.campaign_browser.subtitle', {
              event_hashtag: t('campaign.event_hashtag'),
              enter: <br />
            })}
          </p>
        </div>
        <img src={wearableIcon} alt={t('campaign.event_hashtag')} className="event-banner-icon" />
      </div>
      <Mobile>
        <div className="event-banner-vertical-icon" />
      </Mobile>
    </div>
  )
}

export default CampaignBrowserBanner
