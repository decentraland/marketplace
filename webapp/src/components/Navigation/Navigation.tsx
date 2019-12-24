import React from 'react'
import { Tabs } from 'decentraland-ui'
import { locations } from '../../modules/routing/locations'
import { Props } from './Navigation.types'

export default class Navigation extends React.PureComponent<Props> {
  render() {
    const { address, isFullscreen, onNavigate } = this.props
    return (
      <Tabs isFullscreen={isFullscreen}>
        <Tabs.Left>
          <Tabs.Tab active onClick={() => onNavigate(locations.atlas())}>
            Atlas
          </Tabs.Tab>
          <Tabs.Tab onClick={() => onNavigate(locations.market())}>
            Market
          </Tabs.Tab>
          {address && (
            <Tabs.Tab onClick={() => onNavigate(locations.address(address))}>
              My Assets
            </Tabs.Tab>
          )}
        </Tabs.Left>
      </Tabs>
    )
  }
}
