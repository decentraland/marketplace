import React, { useCallback, useEffect } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isMobile } from 'decentraland-dapps/dist/lib/utils'
import { Page, Hero, Button } from 'decentraland-ui'
import { locations } from '../../modules/routing/locations'
import { Section, SortDirection } from '../../modules/routing/search'
import { NFTCategory, NFTSortBy } from '../../modules/nft/types'
import { View } from '../../modules/ui/types'
import { Vendors } from '../../modules/vendor/types'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Slideshow } from './Slideshow'
import { Props } from './HomePage.types'
import './HomePage.css'

const HomePage = (props: Props) => {
  const {
    wearables,
    ens,
    land,
    isWearablesLoading,
    isENSLoading,
    isLandLoading,
    onNavigate,
    onFetchNFTs
  } = props

  const handleGetStarted = useCallback(() => onNavigate(locations.browse()), [
    onNavigate
  ])

  const handleViewWearables = useCallback(
    () => onNavigate(locations.browse({ section: Section.WEARABLES })),
    [onNavigate]
  )

  const handleViewLand = useCallback(
    () => onNavigate(locations.browse({ section: Section.LAND })),
    [onNavigate]
  )

  const handleViewEns = useCallback(
    () => onNavigate(locations.browse({ section: Section.ENS })),
    [onNavigate]
  )

  const vendor = Vendors.DECENTRALAND

  useEffect(() => {
    onFetchNFTs({
      vendor,
      view: View.HOME_WEARABLES,
      params: {
        first: 20,
        skip: 0,
        orderDirection: SortDirection.DESC,
        orderBy: NFTSortBy.ORDER_CREATED_AT,
        category: NFTCategory.WEARABLE,
        onlyOnSale: true
      }
    })
    onFetchNFTs({
      vendor,
      view: View.HOME_LAND,
      params: {
        first: 20,
        skip: 0,
        orderDirection: SortDirection.DESC,
        orderBy: NFTSortBy.ORDER_CREATED_AT,
        onlyOnSale: true
        // isLand: true
      }
    })
    onFetchNFTs({
      vendor,
      view: View.HOME_ENS,
      params: {
        first: 20,
        skip: 0,
        category: NFTCategory.ENS,
        orderDirection: SortDirection.DESC,
        orderBy: NFTSortBy.ORDER_CREATED_AT,
        onlyOnSale: true
      }
    })
  }, [vendor, onFetchNFTs])

  return (
    <>
      <Navbar isFullscreen isOverlay />
      <Hero centered={isMobile()} className="HomePageHero">
        <Hero.Header>{t('home_page.title')}</Hero.Header>
        <Hero.Description>{t('home_page.subtitle')}</Hero.Description>
        <Hero.Content>
          <div className="hero-image" />}{' '}
        </Hero.Content>
        <Hero.Actions>
          <Button primary onClick={handleGetStarted}>
            {t('home_page.get_started')}
          </Button>
        </Hero.Actions>
      </Hero>
      <Page className="HomePage">
        <Slideshow
          title={t('home_page.wearables')}
          nfts={wearables}
          isLoading={isWearablesLoading}
          onViewAll={handleViewWearables}
        />
        <Slideshow
          title={t('home_page.land')}
          nfts={land}
          isLoading={isENSLoading}
          onViewAll={handleViewLand}
        />
        <Slideshow
          title={t('home_page.ens')}
          nfts={ens}
          isLoading={isLandLoading}
          onViewAll={handleViewEns}
        />
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(HomePage)
