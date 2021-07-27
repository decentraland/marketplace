import React from 'react'
import { Link } from 'react-router-dom'
import { Tabs, Responsive } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../modules/routing/locations'
import { VendorName } from '../../modules/vendor'
import { SortBy } from '../../modules/routing/types'
import * as decentraland from '../../modules/vendor/decentraland'
import { Props, NavigationTab } from './Navigation.types'

const Navigation = (props: Props) => {
  const { activeTab, isFullscreen } = props
  return (
    <Tabs isFullscreen={isFullscreen}>
      <Tabs.Left>
        <Link to={locations.lands()}>
          <Tabs.Tab active={activeTab === NavigationTab.LANDS}>
            {t('navigation.land')}
          </Tabs.Tab>
        </Link>
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
        <Link to={locations.partners()}>
          <Tabs.Tab
            active={
              activeTab === NavigationTab.PARTNERS ||
              activeTab === NavigationTab.PARTNER
            }
          >
            {t('navigation.partners')}
          </Tabs.Tab>
        </Link>
        <Link to={locations.currentAccount()}>
          <Tabs.Tab active={activeTab === NavigationTab.MY_ASSETS}>
            {t('navigation.my_assets')}
          </Tabs.Tab>
        </Link>
        <Link to={locations.bids()}>
          <Tabs.Tab active={activeTab === NavigationTab.MY_BIDS}>
            {t('navigation.my_bids')}
          </Tabs.Tab>
        </Link>
        <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
          <Link to={locations.activity()}>
            <Tabs.Tab active={activeTab === NavigationTab.ACTIVITY}>
              {t('navigation.activity')}
            </Tabs.Tab>
          </Link>
        </Responsive>
      </Tabs.Left>
    </Tabs>
  )
}

export default React.memo(Navigation)
