import React from 'react'
import { Footer } from 'decentraland-dapps/dist/containers'
import { Page } from 'decentraland-ui'

import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { Props } from './SettingsPage.types'
import './SettingsPage.css'

const SettingsPage = (_: Props) => {
  return (
    <>
      <Navbar isFullscreen />
      <Navigation />
      <Page className="SettingsPage">SETTINGS</Page>
      <Footer />
    </>
  )
}

export default React.memo(SettingsPage)
