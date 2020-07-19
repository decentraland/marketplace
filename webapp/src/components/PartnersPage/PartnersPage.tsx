import React, { useEffect, useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Page, Responsive } from 'decentraland-ui'

import { locations } from '../../modules/routing/locations'
import { SortBy } from '../../modules/routing/types'
import { View } from '../../modules/ui/types'
import { Vendors } from '../../modules/vendor/types'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Row } from '../Layout/Row'
import { Column } from '../Layout/Column'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { PartnersSidebar } from '../PartnersSidebar'
import { Slideshow } from '../HomePage/Slideshow'
import { Props } from './PartnersPage.types'
import './PartnersPage.css'

const PartnersPage = (props: Props) => {
  const {
    superRare,
    isSuperRareLoading,
    onNavigate,
    onFetchNFTsFromRoute
  } = props

  const handleOnNavigate = useCallback(
    (vendor: Vendors) => {
      onNavigate(locations.browse({ vendor }))
    },
    [onNavigate]
  )

  // TODO: Check if we can render this Component this just looping Partner

  // Kick things off
  useEffect(() => {
    onFetchNFTsFromRoute({
      view: View.PARTNERS_SUPER_RARE,
      vendor: Vendors.SUPER_RARE,
      sortBy: SortBy.RECENTLY_LISTED,
      page: 1,
      onlyOnSale: true
    })
  }, [onFetchNFTsFromRoute])

  return (
    <>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.PARTNERS} />

      <Page className="PartnersPage">
        <Row>
          <Column align="left">
            <Responsive minWidth={Responsive.onlyTablet.minWidth}>
              <PartnersSidebar onMenuItemClick={handleOnNavigate} />
            </Responsive>
          </Column>
          <Column align="right" grow={true}>
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
