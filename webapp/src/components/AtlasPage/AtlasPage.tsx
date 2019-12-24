import React from 'react'
import { Navbar, Footer } from 'decentraland-dapps/dist/containers'
import { Page, Atlas, AtlasTile } from 'decentraland-ui'

import { Navigation } from '../Navigation'

// TODO: move this to redux so we can reuse it from other <Atlas /> instances
let tiles: Record<string, AtlasTile>
Atlas.fetchTiles().then(_tiles => (tiles = _tiles))

export default class AtlasPage extends React.PureComponent {
  render() {
    return (
      <>
        <Navbar isFullscreen activePage="marketplace" />
        <Navigation isFullscreen activeTab="atlas" />
        <Page isFullscreen>
          <Atlas tiles={tiles} />
        </Page>
        <Footer isFullscreen />
      </>
    )
  }
}
