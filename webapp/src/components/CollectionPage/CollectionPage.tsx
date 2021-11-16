import React from 'react'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Page } from 'decentraland-ui'

const CollectionPage = () => {
  return (
    <div className="AccountPage">
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.MY_STORE} />
      <Page></Page>
      <Footer />
    </div>
  )
}

export default React.memo(CollectionPage)
