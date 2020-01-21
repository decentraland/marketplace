import React from 'react'
import { Footer } from 'decentraland-dapps/dist/containers'
import { Page } from 'decentraland-ui'

import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { Atlas } from '../Atlas'

const AtlasPage = () => {
  return (
    <>
      <Navbar isFullscreen />
      <Navigation isFullscreen activeTab="atlas" />
      <Page isFullscreen>
        <Atlas />
      </Page>
      <Footer isFullscreen />
    </>
  )
}

export default React.memo(AtlasPage)
