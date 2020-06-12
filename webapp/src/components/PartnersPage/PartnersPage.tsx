import React, { useEffect, useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Page, Grid, Responsive } from 'decentraland-ui'

import { locations } from '../../modules/routing/locations'
import { SortDirection } from '../../modules/routing/search'
import { View } from '../../modules/ui/types'
import { NFTSortBy, NFTCategory } from '../../modules/nft/types'
import { Vendors } from '../../modules/vendor/types'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { PartnersMenu } from '../PartnersMenu'
import { Slideshow } from '../HomePage/Slideshow'
import { Props } from './PartnersPage.types'
import './PartnersPage.css'

const PartnersPage = (props: Props) => {
  const { nfts, isLoading, onFetchNFTs, onNavigate } = props

  const handleOnNavigate = useCallback(
    (vendor: Vendors) => {
      onNavigate(locations.browse(vendor))
    },
    [onNavigate]
  )

  // Kick things off
  useEffect(() => {
    onFetchNFTs({
      variables: {
        category: NFTCategory.WEARABLE,
        first: 20,
        skip: 0,
        orderDirection: SortDirection.DESC,
        orderBy: NFTSortBy.ORDER_CREATED_AT,
        onlyOnSale: true
      },
      vendor: Vendors.DECENTRALAND,
      view: View.HOME_WEARABLES
    })
    onFetchNFTs({
      variables: {
        isLand: true,
        first: 20,
        skip: 0,
        orderDirection: SortDirection.DESC,
        orderBy: NFTSortBy.ORDER_CREATED_AT,
        onlyOnSale: true
      },
      vendor: Vendors.DECENTRALAND,
      view: View.HOME_LAND
    })
    onFetchNFTs({
      variables: {
        category: NFTCategory.ENS,
        first: 20,
        skip: 0,
        orderDirection: SortDirection.DESC,
        orderBy: NFTSortBy.ORDER_CREATED_AT,
        onlyOnSale: true
      },
      vendor: Vendors.DECENTRALAND,
      view: View.HOME_ENS
    })
  }, [onFetchNFTs])

  return (
    <div className="PartnersPage">
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.PARTNERS} />

      <Page>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Grid.Column className="left-column">
            <PartnersMenu onMenuItemClick={handleOnNavigate} />
          </Grid.Column>
        </Responsive>
        <Grid.Column className="right-column">
          <Slideshow
            title={t('home_page.wearables')}
            nfts={nfts}
            isLoading={isLoading}
            onViewAll={() => ({})}
          />
        </Grid.Column>
      </Page>
    </div>
  )
}

export default React.memo(PartnersPage)
