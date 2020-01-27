import React from 'react'
import { Page } from 'decentraland-ui'

import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { Atlas } from '../Atlas'

const AtlasPage = () => {
  return (
    <>
      <Navbar isFullscreen />
      <Navigation isFullscreen activeTab="atlas" />
      <Page isFullscreen>
        <Atlas withNavigation />
      </Page>
      <Footer isFullscreen />
    </>
  )
}

export default React.memo(AtlasPage)
