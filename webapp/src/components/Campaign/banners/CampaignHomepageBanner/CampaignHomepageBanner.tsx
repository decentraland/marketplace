import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import logo from '../logo.png'
import './CampaignHomepageBanner.css'

const CampaignHomepageBanner: React.FC = () => {
  return (
    <div className="CampaignHomepageBanner">
      <div className="event-banner-text event-banner-logo-container">
        <img
          src={logo}
          alt={t('campaign.event_hashtag')}
          className="event-banner-logo"
        />
      </div>
      <div className="event-banner-text">
        <span className="title">{t('event_campaign.homepage.title')}</span>
        <span className="subtitle">
          {t('event_campaign.homepage.subtitle', {
            event_hashtag: (
              <b className="event-banner-pink">{t('campaign.event_hashtag')}</b>
            ),
            enter: <br />
          })}
        </span>
      </div>
      <div className="event-banner-bird" />
    </div>
  )
}

export default CampaignHomepageBanner
