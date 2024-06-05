import React, { useCallback, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { BackToTopButton, Page } from 'decentraland-ui'
import { AssetType } from '../../modules/asset/types'
import { locations } from '../../modules/routing/locations'
import { BrowseOptions, SortBy } from '../../modules/routing/types'
import { HomepageView } from '../../modules/ui/asset/homepage/types'
import { View } from '../../modules/ui/types'
import { Section } from '../../modules/vendor/decentraland/routing/types'
import { VendorName } from '../../modules/vendor/types'
import { AssetStatusFilter } from '../../utils/filters'
import { AnalyticsVolumeDayData } from '../AnalyticsVolumeDayData'
import { CampaignHomepageBanner } from '../Campaign/banners/CampaignHomepageBanner'
import { CampaignBanner } from '../Campaign/CampaignBanner'
import { SmartWearablesLaunchModal } from '../Modals/FTU/SmartWearablesLaunchModal'
import { ListsLaunchModal } from '../Modals/ListsLaunchModal'
import { NavigationTab } from '../Navigation/Navigation.types'
import { PageLayout } from '../PageLayout'
import { RankingsTable } from '../RankingsTable'
import { RecentlySoldTable } from '../RecentlySoldTable'
import { Slideshow } from './Slideshow'
import { Props } from './HomePage.types'
import './HomePage.css'

const HomePage = (props: Props) => {
  const { homepage, homepageLoading, onFetchAssetsFromRoute, isCampaignHomepageBannerEnabled } = props
  const history = useHistory()
  const vendor = VendorName.DECENTRALAND

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
      [View.HOME_NEW_ITEMS]: SortBy.NEWEST,
      [View.HOME_SOLD_ITEMS]: SortBy.RECENTLY_SOLD,
      [View.HOME_WEARABLES]: SortBy.RECENTLY_LISTED,
      [View.HOME_LAND]: SortBy.RECENTLY_LISTED,
      [View.HOME_ENS]: SortBy.RECENTLY_LISTED
    }),
    []
  )

  const status: Partial<Record<View, AssetStatusFilter>> = useMemo(
    () => ({
      [View.HOME_NEW_ITEMS]: AssetStatusFilter.ON_SALE
    }),
    []
  )

  const handleViewAll = useCallback(
    (view: View, fromEmptyState: boolean = false) => {
      const section = sections[view]
      const assetType = assetTypes[view]
      const sortBy = sort[view]

      let trackMessage: string = ''
      let browseOptions: BrowseOptions = {}

      if (Section.LAND === section) {
        history.push(locations.lands())
      } else if (Section.WEARABLES_TRENDING === section) {
        trackMessage = 'Explore all trending wearables'
        browseOptions = {
          section: Section.WEARABLES,
          assetType: AssetType.ITEM
        }
      } else {
        trackMessage = `View all ${section} section`
        browseOptions = { section, assetType, sortBy }
      }

      if (status[view]) {
        browseOptions.status = status[view]
      }

      if (trackMessage && browseOptions) {
        getAnalytics().track(fromEmptyState ? `${trackMessage} '(from empty state)'` : trackMessage)
        history.push(locations.browse(browseOptions))
      }
    },
    [assetTypes, sort, sections, history]
  )

  const fetchAssetsForView = useCallback(
    (view: View, section?: Section) =>
      onFetchAssetsFromRoute({
        vendor,
        section: section || sections[view],
        view,
        assetType: assetTypes[view],
        sortBy: sort[view],
        page: 1,
        onlyOnSale: true
      }),
    [onFetchAssetsFromRoute, vendor, sections, assetTypes, sort]
  )

  const sectionsEmptyMessages: Partial<Record<View, string>> = useMemo(
    () => ({
      [View.HOME_TRENDING_ITEMS]: t('home_page.home_trending_items_empty_message', {
        br: <br />,
        try_again_link: (
          <div className="empty-state-action-button" onClick={() => fetchAssetsForView(View.HOME_TRENDING_ITEMS)}>
            {t('home_page.home_trending_items_try_again')}
          </div>
        ),
        explore_all_link: (
          <div className="empty-state-action-button" onClick={() => handleViewAll(View.HOME_TRENDING_ITEMS)}>
            {t('home_page.home_trending_items_explore_all_wearables')}
          </div>
        )
      })
    }),
    [fetchAssetsForView, handleViewAll]
  )

  const handleOnChangeItemSection = useCallback(
    (view: HomepageView, section: Section) => {
      sections[view] = section
      fetchAssetsForView(view, section)
    },
    [sections, fetchAssetsForView]
  )

  useEffect(() => {
    let view: HomepageView
    for (view in homepage) {
      fetchAssetsForView(view)
    }
    // eslint-disable-next-line
  }, [fetchAssetsForView])

  const renderSlideshow = (view: HomepageView) => {
    const hasItemsSection = view === View.HOME_NEW_ITEMS || view === View.HOME_WEARABLES

    return (
      <Slideshow
        key={view}
        view={view}
        title={t(`home_page.${view}`)}
        subtitle={sectionsSubtitles[view]}
        viewAllTitle={sectionsViewAllTitle[view]}
        emptyMessage={sectionsEmptyMessages[view]}
        assets={homepageLoading[view] ? [] : homepage[view]}
        hasItemsSection={hasItemsSection}
        isLoading={homepageLoading[view]}
        onViewAll={() => handleViewAll(view)}
        onChangeItemSection={hasItemsSection ? handleOnChangeItemSection : undefined}
      />
    )
  }

  const homepageWithoutLatestSales = Object.keys(homepage).filter(view => view !== View.HOME_SOLD_ITEMS)
  // trending and newest sections
  const firstViewsSection = homepageWithoutLatestSales.splice(0, 2) as HomepageView[]
  // rest of the sections
  const secondViewsSection = homepageWithoutLatestSales as HomepageView[]

  return (
    <PageLayout activeTab={NavigationTab.OVERVIEW}>
      <ListsLaunchModal />
      <SmartWearablesLaunchModal />
      {isCampaignHomepageBannerEnabled ? (
        <CampaignBanner>
          <CampaignHomepageBanner />
        </CampaignBanner>
      ) : null}
      <Page className="HomePage">
        <AnalyticsVolumeDayData />
        {firstViewsSection.map(renderSlideshow)}
        <RankingsTable />
        {secondViewsSection.map(renderSlideshow)}
        <RecentlySoldTable />
      </Page>
      <BackToTopButton />
    </PageLayout>
  )
}

export default React.memo(HomePage)
