import React from 'react'
import { Navbar, Footer } from 'decentraland-dapps/dist/containers'
import { Page } from 'decentraland-ui'

import { Navigation } from '../Navigation'

export default class MarketPage extends React.PureComponent {
  render() {
    return (
      <>
        <Navbar isFullscreen activePage="marketplace" />
        <Navigation activeTab="market" />
        <Page>
          <div>Coming soon there will be orders listed here...</div>
        </Page>
        <Footer />
      </>
    )
  }
}
