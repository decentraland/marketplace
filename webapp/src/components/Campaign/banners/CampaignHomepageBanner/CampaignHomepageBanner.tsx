import React from 'react'
import { Link } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button } from 'decentraland-ui'
import { AssetType } from '../../../../modules/asset/types'
import { locations } from '../../../../modules/routing/locations'
import { SortBy } from '../../../../modules/routing/types'
import { VendorName } from '../../../../modules/vendor'
import { Section } from '../../../../modules/vendor/decentraland'
import logo from '../logo.webp'
import { Props } from './CampaignHomepageBanner.types'
import './CampaignHomepageBanner.css'

const CampaignHomepageBanner: React.FC<Props> = (props: Props) => {
  const { type } = props
  const title = type === 'homepage' ? t('event_campaign.homepage.title') : t('event_campaign.campaign_browser.title')
  const subtitle =
    type === 'homepage'
      ? t('event_campaign.homepage.subtitle', {
          event_hashtag: <b className="event-banner-pink">{t('campaign.event_hashtag')}</b>,
          enter: <br />
        })
      : t('event_campaign.campaign_browser.subtitle', {
          event_hashtag: t('campaign.event_hashtag'),
          enter: <br />
        })

  return (
    <div className="CampaignHomepageBanner">
      <div className="event-banner-text">
        <span className="title">{title}</span>
        <span className="subtitle">{subtitle}</span>
        {type === 'homepage' ? (
          <Button
            primary
            className="cta"
            as={Link}
            to={locations.campaign({
              section: Section.WEARABLES,
              vendor: VendorName.DECENTRALAND,
              page: 1,
              sortBy: SortBy.RECENTLY_LISTED,
              onlyOnSale: true,
              assetType: AssetType.ITEM
            })}
          >
            {t('event_campaign.homepage.cta')}
          </Button>
        ) : null}
      </div>
      <img src={logo} className="event-banner-logo" alt={t('campaign.event_hashtag')} />
    </div>
  )
}

export default CampaignHomepageBanner
