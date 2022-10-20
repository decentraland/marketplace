import React from 'react'
import { Link } from 'react-router-dom'
import { Tabs, Mobile } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import * as decentraland from '../../modules/vendor/decentraland'
import { locations } from '../../modules/routing/locations'
import { VendorName } from '../../modules/vendor'
import { SortBy } from '../../modules/routing/types'
import { AssetType } from '../../modules/asset/types'
import { Props, NavigationTab } from './Navigation.types'
import './Navigation.css'

const Navigation = (props: Props) => {
  const { activeTab, isFullscreen, isMVMFTabEnabled } = props
  return (
    <Tabs isFullscreen={isFullscreen}>
      <Tabs.Left>
        <Link to={locations.root()}>
          <Tabs.Tab active={activeTab === NavigationTab.OVERVIEW}>
            {t('navigation.overview')}
          </Tabs.Tab>
        </Link>
        {isMVMFTabEnabled ? (
          <Link
            to={locations.MVMF22({
              section: decentraland.Section.WEARABLES,
              vendor: VendorName.DECENTRALAND,
              page: 1,
              sortBy: SortBy.RECENTLY_LISTED,
              onlyOnSale: true,
              assetType: AssetType.ITEM
            })}
          >
            <Tabs.Tab active={activeTab === NavigationTab.MVMF}>
              <div className="mvmf-tab">
                <span className="mvmf-icon" />
                <span>{t('navigation.mvmf')}</span>
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
        <Mobile>
          <Link to={locations.activity()}>
            <Tabs.Tab active={activeTab === NavigationTab.ACTIVITY}>
              {t('navigation.activity')}
            </Tabs.Tab>
          </Link>
        </Mobile>
      </Tabs.Left>
    </Tabs>
  )
}

export default React.memo(Navigation)
