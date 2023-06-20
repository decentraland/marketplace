import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Desktop, TabletAndBelow } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../../modules/routing/locations'
import { AssetType } from '../../../../modules/asset/types'
import * as decentraland from '../../../../modules/vendor/decentraland'
import { VendorName } from '../../../../modules/vendor'
import { SortBy } from '../../../../modules/routing/types'
import logo from '../pride-logo.png'
import hat from '../pride_hat.png'
import './CampaignHomepageBanner.css'

const CampaignHomepageBanner: React.FC = () => {
  return (
    <div className="CampaignHomepageBanner">
      <div className="event-banner-text event-banner-logo-container">
        <span className="subtitle">{t('event_campaign.homepage.dates')}</span>
        <img
          src={logo}
          alt={t('campaign.event_hashtag')}
          className="event-banner-logo"
        />
        <span>{t('event_campaign.homepage.slogan')}</span>
      </div>
      <div className="event-banner-text">
        <span className="title">{t('event_campaign.homepage.title')}</span>
        <Desktop>
          <span className="subtitle">
            {t('event_campaign.homepage.subtitle', {
              event_hashtag: (
                <b className="event-banner-pink">
                  {t('campaign.event_hashtag')}
                </b>
              ),
              enter: <br />
            })}
          </span>
        </Desktop>
        <TabletAndBelow>
          <span className="subtitle">
            {t('event_campaign.homepage.subtitle_mobile')}
          </span>
        </TabletAndBelow>
        <Button
          primary
          as={Link}
          to={locations.campaign({
            section: decentraland.Section.WEARABLES,
            vendor: VendorName.DECENTRALAND,
            page: 1,
            sortBy: SortBy.RECENTLY_LISTED,
            assetType: AssetType.ITEM,
            onlyOnSale: true
          })}
          className="event-banner-browse-button"
        >
          {t('event_campaign.homepage.cta')}
        </Button>
      </div>
      <img
        src={hat}
        alt={t('campaign.event_tag')}
        className="event-banner-hat"
      />
    </div>
  )
}

export default CampaignHomepageBanner
