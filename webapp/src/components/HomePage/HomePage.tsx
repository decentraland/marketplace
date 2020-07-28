import React, { useCallback, useEffect } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isMobile } from 'decentraland-dapps/dist/lib/utils'
import { Page, Hero, Button } from 'decentraland-ui'
import { locations } from '../../modules/routing/locations'
import { View } from '../../modules/ui/types'
import { Vendors } from '../../modules/vendor/types'
import { SortBy } from '../../modules/routing/types'
import { Section } from '../../modules/vendor/decentraland/routing/types'
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
    onFetchNFTsFromRoute
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
    onFetchNFTsFromRoute({
      vendor,
      section: Section.WEARABLES,
      view: View.HOME_WEARABLES,
      sortBy: SortBy.RECENTLY_LISTED,
      page: 1,
      onlyOnSale: true
    })
    onFetchNFTsFromRoute({
      vendor,
      section: Section.LAND,
      view: View.HOME_LAND,
      sortBy: SortBy.RECENTLY_LISTED,
      page: 1,
      onlyOnSale: true
    })
    onFetchNFTsFromRoute({
      vendor,
      section: Section.ENS,
      view: View.HOME_ENS,
      sortBy: SortBy.RECENTLY_LISTED,
      page: 1,
      onlyOnSale: true
    })
  }, [vendor, onFetchNFTsFromRoute])

  return (
    <>
      <Navbar isFullscreen isOverlay />
      <Hero centered={isMobile()} className="HomePageHero">
        <Hero.Header>{t('home_page.title')}</Hero.Header>
        <Hero.Description>{t('home_page.subtitle')}</Hero.Description>
        <Hero.Content>
          <div className="hero-image" />{' '}
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
