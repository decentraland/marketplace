import React from 'react'
import {} from 'decentraland-dapps/dist/containers'
import { Page, Atlas } from 'decentraland-ui'

import { Navigation } from '../Navigation'

export default class AtlasPage extends React.PureComponent {
  render() {
    return (
      <>
        <Navigation isFullscreen />
        <Page isFullscreen>
          <Atlas />
        </Page>
      </>
    )
  }
}
