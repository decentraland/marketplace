import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Tabs, Mobile, Button, useMobileMediaQuery } from 'decentraland-ui'
import { AssetType } from '../../modules/asset/types'
import { locations } from '../../modules/routing/locations'
import { SortBy } from '../../modules/routing/types'
import { VendorName } from '../../modules/vendor'
import { Section } from '../../modules/vendor/decentraland'
import * as decentraland from '../../modules/vendor/decentraland'
import * as events from '../../utils/events'
import { AssetStatusFilter } from '../../utils/filters'
import { CAMPAING_TAB_ANIMATION_ENABLED } from '../Campaign/config'
import { Props, NavigationTab } from './Navigation.types'
import './Navigation.css'

const Navigation = (props: Props) => {
  const { activeTab, isFullscreen, isCampaignBrowserEnabled, onOpenBuyManaWithFiatModal, onClearFilters } = props
  const analytics = getAnalytics()
  const isMobile = useMobileMediaQuery()

  const handleOpenBuyManaWithFiatModal = () => {
    analytics.track(events.OPEN_BUY_MANA_MODAL)
    onOpenBuyManaWithFiatModal()
  }

  const browseDefaultOptions = {
    section: decentraland.Section.WEARABLES,
    vendor: VendorName.DECENTRALAND,
    page: 1,
    sortBy: SortBy.NEWEST,
    status: AssetStatusFilter.ON_SALE
  }

  return (
    <div className="Navigation">
      <Tabs isFullscreen={isFullscreen}>
        <Tabs.Left>
          <Link to={locations.root()}>
            <Tabs.Tab active={activeTab === NavigationTab.OVERVIEW}>{t('navigation.overview')}</Tabs.Tab>
          </Link>
          {isCampaignBrowserEnabled ? (
            <Link
              to={locations.campaign({
                section: decentraland.Section.WEARABLES,
                vendor: VendorName.DECENTRALAND,
                page: 1,
                sortBy: SortBy.RECENTLY_LISTED,
                onlyOnSale: true,
                assetType: AssetType.ITEM
              })}
            >
              <Tabs.Tab active={activeTab === NavigationTab.CAMPAIGN_BROWSER}>
                <div
                  className={classNames('campaign-tab', {
                    'campaign-tab-animation': CAMPAING_TAB_ANIMATION_ENABLED
                  })}
                >
                  <span>{t('campaign.tab')}</span>
                </div>
              </Tabs.Tab>
            </Link>
          ) : null}
          <Link to={locations.browse(browseDefaultOptions)} onClick={onClearFilters}>
            <Tabs.Tab active={activeTab === NavigationTab.COLLECTIBLES}>{t('navigation.collectibles')}</Tabs.Tab>
          </Link>
          <Link to={locations.lands({ section: Section.LAND, assetType: AssetType.NFT })}>
            <Tabs.Tab active={activeTab === NavigationTab.LANDS}>{t('navigation.land')}</Tabs.Tab>
          </Link>
          <Link to={locations.claimName()}>
            <Tabs.Tab active={activeTab === NavigationTab.NAMES}>{t('navigation.names')}</Tabs.Tab>
          </Link>
          <Link to={locations.defaultCurrentAccount()}>
            <Tabs.Tab active={activeTab === NavigationTab.MY_STORE}>{t('navigation.my_assets')}</Tabs.Tab>
          </Link>
          <Link to={locations.lists()}>
            <Tabs.Tab active={activeTab === NavigationTab.MY_LISTS}>{t('navigation.my_lists')}</Tabs.Tab>
          </Link>
          <Mobile>
            <Link to={locations.activity()}>
              <Tabs.Tab active={activeTab === NavigationTab.ACTIVITY}>{t('navigation.activity')}</Tabs.Tab>
            </Link>
          </Mobile>
        </Tabs.Left>
        {!isMobile ? (
          <Tabs.Right>
            <Button inverted onClick={handleOpenBuyManaWithFiatModal} size="small">
              {t('navigation.buy_mana_with_fiat')}
            </Button>
          </Tabs.Right>
        ) : null}
      </Tabs>
    </div>
  )
}

export default React.memo(Navigation)
