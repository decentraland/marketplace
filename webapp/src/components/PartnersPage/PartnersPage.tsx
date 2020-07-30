import React, { useEffect, useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Page, Responsive } from 'decentraland-ui'

import { locations } from '../../modules/routing/locations'
import { SortBy } from '../../modules/routing/types'
import { PartnerView } from '../../modules/ui/nft/partner/types'
import { Vendors, Partner } from '../../modules/vendor/types'
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
  const { partners, partnersLoading, onNavigate, onFetchNFTsFromRoute } = props

  const handleOnNavigate = useCallback(
    (vendor: Vendors) => {
      onNavigate(locations.browse({ vendor }))
    },
    [onNavigate]
  )

  // Kick things off
  useEffect(() => {
    let view: Partner
    for (view in partners) {
      onFetchNFTsFromRoute({
        view,
        vendor: view,
        sortBy: SortBy.RECENTLY_LISTED,
        page: 1,
        onlyOnSale: true
      })
    }
    // eslint-disable-next-line
  }, [onFetchNFTsFromRoute])

  const views = Object.keys(partners) as PartnerView[]

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
            {views.map(view => (
              <Slideshow
                key={view}
                title={t('partners_page.latest_from', {
                  vendor: t(`vendors.${view}`)
                })}
                nfts={partners[view]}
                isLoading={partners[view].length === 0 || partnersLoading[view]}
                isSubHeader={true}
                onViewAll={() => handleOnNavigate(view as Partner)}
              />
            ))}
          </Column>
        </Row>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(PartnersPage)
