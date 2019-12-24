import React from 'react'
import { Tabs } from 'decentraland-ui'
import { locations } from '../../modules/routing/locations'
import { Props } from './Navigation.types'

export default class Navigation extends React.PureComponent<Props> {
  render() {
    const { address, activeTab, isFullscreen, onNavigate } = this.props
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
}
