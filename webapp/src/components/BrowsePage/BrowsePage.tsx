import React, { useCallback } from 'react'

import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { NFTListPage } from '../NFTListPage'
import { NavigationTab } from '../Navigation/Navigation.types'
import { SearchOptions } from '../../modules/routing/search'
import { View } from '../../modules/ui/types'
import { locations } from '../../modules/routing/locations'
import { Props } from './BrowsePage.types'

const BrowsePage = (props: Props) => {
  const { onNavigate } = props

  const handleOnNavigate = useCallback(
    (options?: SearchOptions) => {
      onNavigate(locations.browse(options))
    },
    [onNavigate]
  )

  return (
    <>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.BROWSE} />
      <NFTListPage
        view={View.MARKET}
        defaultOnlyOnSale={true}
        onNavigate={handleOnNavigate}
      />
      <Footer />
    </>
  )
}

export default React.memo(BrowsePage)
