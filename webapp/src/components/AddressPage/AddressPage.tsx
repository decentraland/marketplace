import React from 'react'
import { Navbar, Footer } from 'decentraland-dapps/dist/containers'
import { Page } from 'decentraland-ui'

import { Navigation } from '../Navigation'

export default class AddressPage extends React.PureComponent {
  render() {
    return (
      <>
        <Navbar isFullscreen activePage="marketplace" />
        <Navigation activeTab="address" />
        <Page>
          <div>Coming soon you will see your assets here...</div>
        </Page>
        <Footer />
      </>
    )
  }
}
