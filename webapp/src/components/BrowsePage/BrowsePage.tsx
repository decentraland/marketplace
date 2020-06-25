import React from 'react'

import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { NFTBrowse } from '../NFTBrowse'
import { NavigationTab } from '../Navigation/Navigation.types'
import { View } from '../../modules/ui/types'
import { Props } from './BrowsePage.types'

const BrowsePage = (_: Props) => {
  return (
    <>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.BROWSE} />
      <NFTBrowse view={View.MARKET} defaultOnlyOnSale={true} />
      <Footer />
    </>
  )
}

export default React.memo(BrowsePage)
