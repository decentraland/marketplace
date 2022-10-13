import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Page, Tabs } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { locations } from '../../modules/routing/locations'
import { VendorName } from '../../modules/vendor/types'
import { SortBy } from '../../modules/routing/types'
import { View } from '../../modules/ui/types'
import { AssetType } from '../../modules/asset/types'
import { HomepageView } from '../../modules/ui/asset/homepage/types'
import { Section } from '../../modules/vendor/decentraland/routing/types'
import { Navigation } from '../Navigation'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Navbar } from '../Navbar'
import { RecentlySoldTable } from '../RecentlySoldTable'
import { Footer } from '../Footer'
import { AnalyticsVolumeDayData } from '../AnalyticsVolumeDayData'
import { MVMFBanner } from '../MVMFPage/MVMFBanner'
import { Slideshow } from './Slideshow'
import { RankingsTable } from '../RankingsTable'
import { Props } from './HomePage.types'
import './HomePage.css'

const HomePage = (props: Props) => {
  const {
    homepage,
    homepageLoading,
    onNavigate,
    onFetchAssetsFromRoute
  } = props

  const vendor = VendorName.DECENTRALAND

  const [currentItemSection, setCurrentItemSection] = useState<
    Partial<Record<View, Section>>
  >({
    [View.HOME_NEW_ITEMS]: Section.WEARABLES,
    [View.HOME_WEARABLES]: Section.WEARABLES
  })

  const sections: Partial<Record<View, Section>> = useMemo(
    () => ({
      [View.HOME_TRENDING_ITEMS]: Section.WEARABLES_TRENDING,
      [View.HOME_NEW_ITEMS]: Section.WEARABLES,
      [View.HOME_WEARABLES]: Section.WEARABLES,
      [View.HOME_LAND]: Section.LAND,
      [View.HOME_ENS]: Section.ENS
    }),
    []
  )

  const sectionsSubtitles: Partial<Record<View, string>> = useMemo(
    () => ({
      [View.HOME_TRENDING_ITEMS]: t('home_page.home_trending_items_subtitle'),
      [View.HOME_WEARABLES]: t('home_page.home_recently_listed_items_subtitle')
    }),
    []
  )

  const sectionsViewAllTitle: Partial<Record<View, string>> = useMemo(
    () => ({
      [View.HOME_TRENDING_ITEMS]: t('home_page.home_trending_items_explore_all')
    }),
    []
  )

  const assetTypes: Partial<Record<View, AssetType>> = useMemo(
    () => ({
      [View.HOME_TRENDING_ITEMS]: AssetType.ITEM,
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

  const getSection = useCallback(
    (view: View) => {
      return view === View.HOME_NEW_ITEMS || view === View.HOME_WEARABLES
        ? currentItemSection[view]
        : sections[view]
    },
    [sections, currentItemSection]
  )

  const handleViewAll = useCallback(
    (view: View) => {
      const section = getSection(view)
      const assetType = assetTypes[view]
      const sortBy = sort[view]

      if (Section.LAND === section) {
        onNavigate(locations.lands())
      } else if (Section.WEARABLES_TRENDING === section) {
        getAnalytics().track('Explore all trending wearables')
        onNavigate(
          locations.browse({
            section: Section.WEARABLES,
            assetType: AssetType.ITEM
          })
        )
      } else {
        getAnalytics().track(`View all ${section} section`)
        onNavigate(locations.browse({ section, assetType, sortBy }))
      }
    },
    [assetTypes, sort, getSection, onNavigate]
  )

  const handleOnChangeItemSection = useCallback(
    (view: HomepageView, section: Section) => {
      setCurrentItemSection(currentItemSection => ({
        ...currentItemSection,
        [view]: section
      }))
      onFetchAssetsFromRoute({
        vendor,
        section,
        view,
        assetType: assetTypes[view],
        sortBy: sort[view],
        page: 1,
        onlyOnSale: true
      })
    },
    [assetTypes, sort, vendor, onFetchAssetsFromRoute, setCurrentItemSection]
  )

  useEffect(() => {
    let view: HomepageView
    for (view in homepage) {
      onFetchAssetsFromRoute({
        vendor,
        section: getSection(view),
        view,
        assetType: assetTypes[view],
        sortBy: sort[view],
        page: 1,
        onlyOnSale: true
      })
    }
    // eslint-disable-next-line
  }, [onFetchAssetsFromRoute])

  const itemsSections = (view: HomepageView) => (
    <Tabs isFullscreen>
      <Tabs.Left>
        <Tabs.Tab
          active={currentItemSection[view] === Section.WEARABLES}
          onClick={() => handleOnChangeItemSection(view, Section.WEARABLES)}
        >
          <div id={Section.WEARABLES}>{t(`menu.${Section.WEARABLES}`)}</div>
        </Tabs.Tab>
        <Tabs.Tab
          active={currentItemSection[view] === Section.EMOTES}
          onClick={() => handleOnChangeItemSection(view, Section.EMOTES)}
        >
          <div id={Section.EMOTES}>{t(`menu.${Section.EMOTES}`)}</div>
        </Tabs.Tab>
      </Tabs.Left>
    </Tabs>
  )

  const renderSlideshow = (view: HomepageView) => {
    const hasItemsSection =
      view === View.HOME_NEW_ITEMS || view === View.HOME_WEARABLES

    return (
      <Slideshow
        key={view}
        title={t(`home_page.${view}`)}
        subtitle={sectionsSubtitles[view]}
        viewAllTitle={sectionsViewAllTitle[view]}
        assets={homepageLoading[view] ? [] : homepage[view]}
        sections={hasItemsSection ? itemsSections(view) : null}
        isLoading={homepageLoading[view]}
        onViewAll={() => handleViewAll(view)}
      />
    )
  }

  const homepageWithoutLatestSales = Object.keys(homepage).filter(
    view => view !== View.HOME_SOLD_ITEMS
  )
  // trending and newest sections
  const firstViewsSection = homepageWithoutLatestSales.splice(
    0,
    2
  ) as HomepageView[]
  // rest of the sections
  const secondViewsSection = homepageWithoutLatestSales as HomepageView[]

  return (
    <>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.OVERVIEW} />
      <MVMFBanner type="big" />
      <Page className="HomePage">
        <AnalyticsVolumeDayData />
        {firstViewsSection.map(renderSlideshow)}
        <RankingsTable />
        {secondViewsSection.map(renderSlideshow)}
        <RecentlySoldTable />
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(HomePage)
