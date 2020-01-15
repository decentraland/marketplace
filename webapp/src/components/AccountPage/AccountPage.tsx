import React from 'react'
import { Navbar, Footer } from 'decentraland-dapps/dist/containers'
import { Page } from 'decentraland-ui'

import { Navigation } from '../Navigation'

const AccountPage = () => {
  return (
    <>
      <Navbar isFullscreen activePage="marketplace" />
      <Navigation activeTab="account" />
      <Page>
        <div>Coming soon you will see your assets here...</div>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(AccountPage)
