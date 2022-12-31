import React from 'react'

import { VendorName } from '../../modules/vendor/types'
import { View } from '../../modules/ui/types'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Section } from '../../modules/vendor/decentraland'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { AssetBrowse } from '../AssetBrowse'
import { Props } from './LandsPage.types'

const LandsPage = (props: Props) => {
  const { isFullscreen } = props
  return (
    <>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.LANDS} />
      <AssetBrowse
        vendor={VendorName.DECENTRALAND}
        view={View.MARKET}
        sections={[Section.LAND]}
      />
      <Footer isFullscreen={isFullscreen} />
    </>
  )
}

export default React.memo(LandsPage)
