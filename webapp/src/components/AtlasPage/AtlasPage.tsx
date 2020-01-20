import React from 'react'
import { Footer } from 'decentraland-dapps/dist/containers'
import { Page, Atlas, AtlasTile } from 'decentraland-ui'

import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'

// TODO: move this to redux so we can reuse it from other <Atlas /> instances
let tiles: Record<string, AtlasTile>
Atlas.fetchTiles().then(_tiles => (tiles = _tiles))

const AtlasPage = () => {
  return (
    <>
      <Navbar isFullscreen />
      <Navigation isFullscreen activeTab="atlas" />
      <Page isFullscreen>
        <Atlas tiles={tiles} />
      </Page>
      <Footer isFullscreen />
    </>
  )
}

export default React.memo(AtlasPage)
