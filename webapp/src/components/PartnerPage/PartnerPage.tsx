import React from 'react'

import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { NFTBrowse } from '../NFTBrowse'
import { NavigationTab } from '../Navigation/Navigation.types'
import { View } from '../../modules/ui/types'
import { Vendors } from '../../modules/vendor/types'
import { Props } from './PartnerPage.types'

const PartnerPage = (props: Props) => {
  // TODO: Validate valid vendor
  const vendor = props.vendor as Vendors

  return (
    <>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.PARTNER} />
      <NFTBrowse vendor={vendor} view={View.MARKET} defaultOnlyOnSale={true} />
      <Footer />
    </>
  )
}

export default React.memo(PartnerPage)
