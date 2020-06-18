import React, { useEffect, useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Page, Grid, Responsive } from 'decentraland-ui'

import { locations } from '../../modules/routing/locations'
import { SortDirection } from '../../modules/routing/search'
import { View } from '../../modules/ui/types'
import { NFTSortBy } from '../../modules/nft/types'
import { Vendors } from '../../modules/vendor/types'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { PartnersMenu } from '../PartnersMenu'
import { Slideshow } from '../HomePage/Slideshow'
import { Props } from './PartnersPage.types'
import './PartnersPage.css'

const PartnersPage = (props: Props) => {
  const { superRare, isSuperRareLoading, onFetchNFTs, onNavigate } = props

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
        first: 10,
        skip: 0,
        orderDirection: SortDirection.DESC,
        orderBy: NFTSortBy.ORDER_CREATED_AT,
        onlyOnSale: true
      },
      vendor: Vendors.SUPER_RARE,
      view: View.PARTNERS_SUPER_RARE
    })
  }, [onFetchNFTs])

  return (
    <>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.PARTNERS} />

      <Page className="PartnersPage">
        <Grid.Column className="left-column">
          <Responsive minWidth={Responsive.onlyTablet.minWidth}>
            <PartnersMenu onMenuItemClick={handleOnNavigate} />
          </Responsive>
        </Grid.Column>
        <Grid.Column className="right-column">
          <Slideshow
            title={t('partners_page.latest_from', {
              vendor: t('vendors.super_rare')
            })}
            nfts={superRare}
            isSubHeader={true}
            isLoading={isSuperRareLoading}
            onViewAll={() => handleOnNavigate(Vendors.SUPER_RARE)}
          />
        </Grid.Column>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(PartnersPage)
