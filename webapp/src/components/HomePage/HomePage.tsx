import React, { useCallback, useEffect, useMemo } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isMobile } from 'decentraland-dapps/dist/lib/utils'
import { Page, Hero, Button } from 'decentraland-ui'
import { locations } from '../../modules/routing/locations'
import { VendorName } from '../../modules/vendor/types'
import { SortBy } from '../../modules/routing/types'
import { View } from '../../modules/ui/types'
import { AssetType } from '../../modules/asset/types'
import { HomepageView } from '../../modules/ui/asset/homepage/types'
import { Section } from '../../modules/vendor/decentraland/routing/types'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Slideshow } from './Slideshow'
import { Props } from './HomePage.types'
import './HomePage.css'

const HomePage = (props: Props) => {
  const {
    homepage,
    homepageLoading,
    onNavigate,
    onFetchAssetsFromRoute
  } = props

  const sections: Partial<Record<View, Section>> = useMemo(
    () => ({
      [View.HOME_NEW_ITEMS]: Section.WEARABLES,
      [View.HOME_SOLD_ITEMS]: Section.WEARABLES,
      [View.HOME_WEARABLES]: Section.WEARABLES,
      [View.HOME_LAND]: Section.LAND,
      [View.HOME_ENS]: Section.ENS
    }),
    []
  )

  const assetTypes: Partial<Record<View, AssetType>> = useMemo(
    () => ({
      [View.HOME_NEW_ITEMS]: AssetType.ITEM,
      [View.HOME_SOLD_ITEMS]: AssetType.ITEM,
      [View.HOME_WEARABLES]: AssetType.NFT,
      [View.HOME_LAND]: AssetType.NFT,
      [View.HOME_ENS]: AssetType.NFT
    }),
    []
  )

  const sort: Partial<Record<View, SortBy>> = useMemo(
    () => ({
      [View.HOME_NEW_ITEMS]: SortBy.RECENTLY_LISTED,
      [View.HOME_SOLD_ITEMS]: SortBy.RECENTLY_SOLD,
      [View.HOME_WEARABLES]: SortBy.RECENTLY_LISTED,
      [View.HOME_LAND]: SortBy.RECENTLY_LISTED,
      [View.HOME_ENS]: SortBy.RECENTLY_LISTED
    }),
    []
  )

  const handleGetStarted = useCallback(() => {
    onNavigate(
      locations.browse({
        section: Section.WEARABLES,
        assetType: AssetType.ITEM
      })
    )
  }, [onNavigate])

  const handleViewAll = useCallback(
    (view: View) => {
      const section = sections[view]
      const assetType = assetTypes[view]
      const sortBy = sort[view]

      if (Section.LAND === section) {
        onNavigate(locations.lands())
      } else {
        onNavigate(locations.browse({ section, assetType, sortBy }))
      }
    },
    [sections, assetTypes, sort, onNavigate]
  )

  const vendor = VendorName.DECENTRALAND

  useEffect(() => {
    let view: HomepageView
    for (view in homepage) {
      const assetType = assetTypes[view]
      const section = sections[view]
      const sortBy = sort[view]
      onFetchAssetsFromRoute({
        vendor,
        section,
        view,
        assetType,
        sortBy,
        page: 1,
        onlyOnSale: true
      })
    }
    // eslint-disable-next-line
  }, [onFetchAssetsFromRoute])

  const views = Object.keys(homepage) as HomepageView[]

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
        {views.map(view => (
          <Slideshow
            key={view}
            title={t(`home_page.${view}`)}
            assets={homepage[view]}
            isLoading={homepageLoading[view]}
            onViewAll={() => handleViewAll(view)}
          />
        ))}
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(HomePage)
