import React from 'react'
import { Tabs } from 'decentraland-ui'
import { locations } from '../../modules/routing/locations'
import { Props } from './Navigation.types'

const Navigation = (props: Props) => {
  const { address, activeTab, isFullscreen, onNavigate } = props
  return (
    <Tabs isFullscreen={isFullscreen}>
      <Tabs.Left>
        <Tabs.Tab
          active={activeTab === 'atlas'}
          onClick={() => onNavigate(locations.atlas())}
        >
          Atlas
        </Tabs.Tab>
        <Tabs.Tab
          active={activeTab === 'market'}
          onClick={() => onNavigate(locations.market())}
        >
          Market
        </Tabs.Tab>
        {address ? (
          <Tabs.Tab
            active={activeTab === 'address'}
            onClick={() => onNavigate(locations.address(address))}
          >
            My Assets
          </Tabs.Tab>
        ) : null}
      </Tabs.Left>
    </Tabs>
  )
}

export default React.memo(Navigation)
