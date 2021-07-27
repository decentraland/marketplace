import React from 'react'

import { isVendor, isPartner } from '../../modules/vendor/utils'
import { VendorName } from '../../modules/vendor/types'
import { View } from '../../modules/ui/types'
import { ResultType } from '../../modules/routing/types'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { NFTBrowse } from '../NFTBrowse'
import { ItemBrowse } from '../ItemBrowse'
import { Props } from './BrowsePage.types'

const BrowsePage = (props: Props) => {
  const { isFullscreen, resultType } = props
  const vendor = isVendor(props.vendor) ? props.vendor : VendorName.DECENTRALAND

  const activeTab = isPartner(vendor)
    ? NavigationTab.PARTNER
    : NavigationTab.COLLECTIBLES

  let result = null
  switch (resultType) {
    case ResultType.NFT:
      result = (
        <NFTBrowse
          vendor={vendor}
          isFullscreen={Boolean(isFullscreen)}
          view={View.MARKET}
        />
      )
      break
    case ResultType.ITEM:
      result = <ItemBrowse view={View.MARKET} />
      break
  }

  return (
    <>
      <Navbar isFullscreen />
      <Navigation activeTab={activeTab} isFullscreen={isFullscreen} />
      {result}
      <Footer isFullscreen={isFullscreen} />
    </>
  )
}

export default React.memo(BrowsePage)
