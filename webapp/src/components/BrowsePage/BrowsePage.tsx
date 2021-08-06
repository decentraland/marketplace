import React from 'react'

import { isVendor, isPartner } from '../../modules/vendor/utils'
import { VendorName } from '../../modules/vendor/types'
import { View } from '../../modules/ui/types'
import { Section } from '../../modules/vendor/decentraland'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { AssetBrowse } from '../AssetBrowse'
import { Props } from './BrowsePage.types'

const BrowsePage = (props: Props) => {
  const { isFullscreen, section } = props
  const vendor = isVendor(props.vendor) ? props.vendor : VendorName.DECENTRALAND

  const activeTab = isPartner(vendor)
    ? NavigationTab.PARTNER
    : NavigationTab.COLLECTIBLES

  return (
    <>
      <Navbar isFullscreen />
      <Navigation activeTab={activeTab} isFullscreen={isFullscreen} />
      <AssetBrowse
        vendor={vendor}
        isFullscreen={Boolean(isFullscreen)}
        view={View.MARKET}
        section={section}
        sections={[Section.WEARABLES, Section.ENS]}
      />
      <Footer isFullscreen={isFullscreen} />
    </>
  )
}

export default React.memo(BrowsePage)
