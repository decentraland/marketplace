import React from 'react'
import { Tabs } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../modules/routing/locations'
import { Props } from './Navigation.types'

const Navigation = (props: Props) => {
  const { activeTab, isFullscreen, onNavigate } = props
  return (
    <Tabs isFullscreen={isFullscreen}>
      <Tabs.Left>
        <Tabs.Tab
          active={activeTab === 'atlas'}
          onClick={() => onNavigate(locations.atlas())}
        >
          {t('navigation.atlas')}
        </Tabs.Tab>
        <Tabs.Tab
          active={activeTab === 'market'}
          onClick={() => onNavigate(locations.market())}
        >
          {t('navigation.market')}
        </Tabs.Tab>
        <Tabs.Tab
          active={activeTab === 'account'}
          onClick={() => onNavigate(locations.currentAccount())}
        >
          {t('navigation.my_account')}
        </Tabs.Tab>
      </Tabs.Left>
    </Tabs>
  )
}

export default React.memo(Navigation)
