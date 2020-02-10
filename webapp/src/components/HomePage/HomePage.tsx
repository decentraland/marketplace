import React, { useCallback, useEffect } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Page, Hero, Button } from 'decentraland-ui'
import { locations } from '../../modules/routing/locations'
import { Section, SortDirection } from '../../modules/routing/search'
import { NFTCategory, NFTSortBy } from '../../modules/nft/types'
import { View } from '../../modules/ui/types'
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

  console.log({
    isWearablesLoading,
    isENSLoading,
    isLandLoading
  })

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

  useEffect(() => {
    onFetchNFTs({
      variables: {
        category: NFTCategory.WEARABLE,
        first: 20,
        skip: 0,
        orderDirection: SortDirection.DESC,
        orderBy: NFTSortBy.CREATED_AT,
        onlyOnSale: true
      },
      view: View.HOME_WEARABLES
    })
    onFetchNFTs({
      variables: {
        isLand: true,
        first: 20,
        skip: 0,
        orderDirection: SortDirection.DESC,
        orderBy: NFTSortBy.CREATED_AT,
        onlyOnSale: true
      },
      view: View.HOME_LAND
    })
    onFetchNFTs({
      variables: {
        category: NFTCategory.ENS,
        first: 20,
        skip: 0,
        orderDirection: SortDirection.DESC,
        orderBy: NFTSortBy.CREATED_AT,
        onlyOnSale: true
      },
      view: View.HOME_ENS
    })
  }, [onFetchNFTs])

  return (
    <>
      <Navbar isFullscreen isOverlay />
      <Hero className="HomePageHero">
        <Hero.Header>{t('home_page.title')}</Hero.Header>
        <Hero.Description>{t('home_page.subtitle')}</Hero.Description>
        <Hero.Content>
          <div className="hero-image" />
        </Hero.Content>
        <Hero.Actions>
          <Button primary onClick={handleGetStarted}>
            {t('home_page.get_started')}
          </Button>
          <Button secondary disabled>
            {t('home_page.learn_more')}
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
