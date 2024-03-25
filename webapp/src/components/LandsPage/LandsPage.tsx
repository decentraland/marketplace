import React from 'react'
import { View } from '../../modules/ui/types'
import { Section } from '../../modules/vendor/decentraland'
import { VendorName } from '../../modules/vendor/types'
import { AssetBrowse } from '../AssetBrowse'
import { Footer } from '../Footer'
import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Props } from './LandsPage.types'

const LandsPage = (props: Props) => {
  const { isFullscreen } = props
  return (
    <>
      <Navbar />
      <Navigation activeTab={NavigationTab.LANDS} />
      <AssetBrowse vendor={VendorName.DECENTRALAND} view={View.MARKET} sections={[Section.LAND]} />
      <Footer isFullscreen={isFullscreen} />
    </>
  )
}

export default React.memo(LandsPage)
