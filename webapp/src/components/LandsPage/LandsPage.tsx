import React from 'react'

import { VendorName } from '../../modules/vendor/types'
import { View } from '../../modules/ui/types'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Section } from '../../modules/vendor/decentraland'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { NFTBrowse } from '../NFTBrowse'
import { Props } from './LandsPage.types'

const BrowsePage = (props: Props) => {
  const { isFullscreen, isMap } = props

  return (
    <>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.LANDS} isFullscreen={isFullscreen} />
      <NFTBrowse
        vendor={VendorName.DECENTRALAND}
        view={View.MARKET}
        isFullscreen={isFullscreen}
        isMap={isMap}
        sections={[Section.LAND]}
      />
      <Footer isFullscreen={isFullscreen} />
    </>
  )
}

export default React.memo(BrowsePage)
