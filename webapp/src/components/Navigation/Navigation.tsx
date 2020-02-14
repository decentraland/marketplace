import React from 'react'
import { Tabs, Responsive } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../modules/routing/locations'
import { Props, NavigationTab } from './Navigation.types'

const Navigation = (props: Props) => {
  const { activeTab, isFullscreen, onNavigate } = props
  return (
    <Tabs isFullscreen={isFullscreen}>
      <Tabs.Left>
        <Tabs.Tab
          active={activeTab === NavigationTab.ATLAS}
          onClick={() => onNavigate(locations.atlas())}
        >
          {t('navigation.atlas')}
        </Tabs.Tab>
        <Tabs.Tab
          active={activeTab === NavigationTab.BROWSE}
          onClick={() => onNavigate(locations.browse())}
        >
          {t('navigation.browse')}
        </Tabs.Tab>
        <Tabs.Tab
          active={activeTab === NavigationTab.MY_ASSETS}
          onClick={() => onNavigate(locations.currentAccount())}
        >
          {t('navigation.my_assets')}
        </Tabs.Tab>
        <Tabs.Tab
          active={activeTab === NavigationTab.MY_BIDS}
          onClick={() => onNavigate(locations.bids())}
        >
          {t('navigation.my_bids')}
        </Tabs.Tab>
        <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
          <Tabs.Tab
            active={activeTab === NavigationTab.ACTIVITY}
            onClick={() => onNavigate(locations.activity())}
          >
            {t('navigation.activity')}
          </Tabs.Tab>
        </Responsive>
      </Tabs.Left>
    </Tabs>
  )
}

export default React.memo(Navigation)
