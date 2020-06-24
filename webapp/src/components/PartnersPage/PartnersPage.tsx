import React, { useEffect, useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Page, Responsive } from 'decentraland-ui'

import { locations } from '../../modules/routing/locations'
import { SortDirection } from '../../modules/routing/search'
import { View } from '../../modules/ui/types'
import { NFTSortBy } from '../../modules/nft/types'
import { Vendors } from '../../modules/vendor/types'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Row } from '../Layout/Row'
import { Column } from '../Layout/Column'
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
      onNavigate(locations.partner(vendor))
    },
    [onNavigate]
  )

  // Kick things off
  useEffect(() => {
    onFetchNFTs(View.PARTNERS_SUPER_RARE, Vendors.SUPER_RARE, {
      first: 10,
      skip: 0,
      orderDirection: SortDirection.DESC,
      orderBy: NFTSortBy.ORDER_CREATED_AT,
      onlyOnSale: true
    })
  }, [onFetchNFTs])

  return (
    <>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.PARTNERS} />

      <Page className="PartnersPage">
        <Row>
          <Column align="left">
            <Responsive minWidth={Responsive.onlyTablet.minWidth}>
              <PartnersMenu onMenuItemClick={handleOnNavigate} />
            </Responsive>
          </Column>
          <Column align="right" grow={isSuperRareLoading}>
            <Slideshow
              title={t('partners_page.latest_from', {
                vendor: t('vendors.super_rare')
              })}
              nfts={superRare}
              isSubHeader={true}
              isLoading={isSuperRareLoading}
              onViewAll={() => handleOnNavigate(Vendors.SUPER_RARE)}
            />
          </Column>
        </Row>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(PartnersPage)
