import React from 'react'
import { Tabs } from 'decentraland-ui'
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
          active={activeTab === NavigationTab.ACCOUNT}
          onClick={() => onNavigate(locations.currentAccount())}
        >
          {t('navigation.my_account')}
        </Tabs.Tab>
      </Tabs.Left>
    </Tabs>
  )
}

export default React.memo(Navigation)
