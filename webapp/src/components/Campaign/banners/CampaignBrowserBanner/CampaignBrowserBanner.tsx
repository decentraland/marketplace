import React from 'react'
import { Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import logo from '../pride-logo.png'
import './CampaignBrowserBanner.css'

const CampaignBrowserBanner: React.FC = () => {
  return (
    <div className="CampaignBrowserBanner">
      <div className="logo-container">
        <img
          src={logo}
          alt={t('campaign.event_hashtag')}
          className="event-banner-logo"
        />
        <span>{t('event_campaign.campaign_browser.slogan')}</span>
      </div>

      <div className="copy">
        <Header>{t('event_campaign.campaign_browser.title')}</Header>
        <p>
          {t('event_campaign.campaign_browser.subtitle', {
            event_hashtag: (
              <b className="event-banner-pink">
                {t('campaign.event_hashtag')}!
              </b>
            ),
            enter: <br />
          })}
        </p>
      </div>
    </div>
  )
}

export default CampaignBrowserBanner
