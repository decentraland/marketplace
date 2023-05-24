import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { Tabs, Mobile, Button, useMobileMediaQuery } from 'decentraland-ui'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import * as decentraland from '../../modules/vendor/decentraland'
import { locations } from '../../modules/routing/locations'
import { VendorName } from '../../modules/vendor'
import { SortBy } from '../../modules/routing/types'
import { AssetType } from '../../modules/asset/types'
import * as events from '../../utils/events'
import { CAMPAING_TAB_ANIMATION_ENABLED } from '../Campaign/config'
import { Props, NavigationTab } from './Navigation.types'
import './Navigation.css'

const Navigation = (props: Props) => {
  const {
    activeTab,
    isFullscreen,
    isCampaignBrowserEnabled,
    onOpenBuyManaWithFiatModal
  } = props
  const analytics = getAnalytics()
  const isMobile = useMobileMediaQuery()

  const handleOpenBuyManaWithFiatModal = () => {
    analytics.track(events.OPEN_BUY_MANA_MODAL)
    onOpenBuyManaWithFiatModal()
  }

  return (
    <div className="Navigation">
      <Tabs isFullscreen={isFullscreen}>
        <Tabs.Left>
          <Link to={locations.root()}>
            <Tabs.Tab active={activeTab === NavigationTab.OVERVIEW}>
              {t('navigation.overview')}
            </Tabs.Tab>
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
          <Link
            to={locations.browse({
              section: decentraland.Section.WEARABLES,
              vendor: VendorName.DECENTRALAND,
              page: 1,
              sortBy: SortBy.RECENTLY_LISTED,
              onlyOnSale: true
            })}
          >
            <Tabs.Tab active={activeTab === NavigationTab.COLLECTIBLES}>
              {t('navigation.collectibles')}
            </Tabs.Tab>
          </Link>
          <Link to={locations.lands()}>
            <Tabs.Tab active={activeTab === NavigationTab.LANDS}>
              {t('navigation.land')}
            </Tabs.Tab>
          </Link>
          <Link to={locations.defaultCurrentAccount()}>
            <Tabs.Tab active={activeTab === NavigationTab.MY_STORE}>
              {t('navigation.my_assets')}
            </Tabs.Tab>
          </Link>
          <Link to={locations.defaultList()}>
            <Tabs.Tab active={activeTab === NavigationTab.MY_LISTS}>
              {t('navigation.my_lists')}
            </Tabs.Tab>
          </Link>
          <Mobile>
            <Link to={locations.activity()}>
              <Tabs.Tab active={activeTab === NavigationTab.ACTIVITY}>
                {t('navigation.activity')}
              </Tabs.Tab>
            </Link>
          </Mobile>
        </Tabs.Left>
        {!isMobile ? (
          <Tabs.Right>
            <Button
              primary
              onClick={handleOpenBuyManaWithFiatModal}
              size="small"
            >
              {t('navigation.buy_mana_with_fiat')}
            </Button>
          </Tabs.Right>
        ) : null}
      </Tabs>
    </div>
  )
}

export default React.memo(Navigation)
