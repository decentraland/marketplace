import React, {
  ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useState
} from 'react'
import { Mobile, NotMobile } from 'decentraland-ui/dist/components/Media'
import { Container } from 'decentraland-ui/dist/components/Container/Container'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import { Page } from 'decentraland-ui/dist/components/Page/Page'
import { Tabs } from 'decentraland-ui/dist/components/Tabs/Tabs'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { View } from '../../modules/ui/types'
import { Section as DecentralandSection } from '../../modules/vendor/decentraland'
import { AssetType } from '../../modules/asset/types'
import { VendorName } from '../../modules/vendor'
import { Section, Sections } from '../../modules/vendor/routing/types'
import { Row } from '../Layout/Row'
import { Column } from '../Layout/Column'
import { Props } from './AssetBrowse.types'
import { OnSaleOrRentType } from '../OnSaleOrRentList/OnSaleOrRentList.types'
import { ToggleBox } from './ToggleBox'
import classNames from 'classnames'
import { isAccountView, isLandSection } from '../../modules/ui/utils'
import './AssetBrowse.css'

const LazyNFTFilters = React.lazy(() => import('../Vendor/NFTFilters'))
const LazyAssetList = React.lazy(() => import('../AssetList'))
const LazyAtlas = React.lazy(() => import('../Atlas'))
const LazyNFTSidebar = React.lazy(() => import('../Vendor/NFTSidebar'))
const LazyAccountSidebar = React.lazy(() => import('../AccountSidebar'))
const LazyCollectionList = React.lazy(() => import('../CollectionList'))
const LazyOnSaleList = React.lazy(() => import('../OnSaleOrRentList'))
const LazyStoreSettings = React.lazy(() => import('../StoreSettings'))
const LazySales = React.lazy(() => import('../Sales'))
const LazyBids = React.lazy(() => import('../Bids'))

const hasPrimarySales = (section?: Section) => {
  switch (section) {
    case DecentralandSection.WEARABLES:
    case DecentralandSection.WEARABLES_HEAD:
    case DecentralandSection.WEARABLES_EYEBROWS:
    case DecentralandSection.WEARABLES_EYES:
    case DecentralandSection.WEARABLES_FACIAL_HAIR:
    case DecentralandSection.WEARABLES_HAIR:
    case DecentralandSection.WEARABLES_MOUTH:
    case DecentralandSection.WEARABLES_UPPER_BODY:
    case DecentralandSection.WEARABLES_LOWER_BODY:
    case DecentralandSection.WEARABLES_FEET:
    case DecentralandSection.WEARABLES_ACCESSORIES:
    case DecentralandSection.WEARABLES_EARRING:
    case DecentralandSection.WEARABLES_EYEWEAR:
    case DecentralandSection.WEARABLES_HAT:
    case DecentralandSection.WEARABLES_HELMET:
    case DecentralandSection.WEARABLES_MASK:
    case DecentralandSection.WEARABLES_TIARA:
    case DecentralandSection.WEARABLES_TOP_HEAD:
    case DecentralandSection.WEARABLES_SKIN:
    case DecentralandSection.EMOTES:
    case DecentralandSection.EMOTES_DANCE:
    case DecentralandSection.EMOTES_STUNT:
    case DecentralandSection.EMOTES_GREETINGS:
    case DecentralandSection.EMOTES_FUN:
    case DecentralandSection.EMOTES_POSES:
    case DecentralandSection.EMOTES_REACTIONS:
    case DecentralandSection.EMOTES_HORROR:
    case DecentralandSection.EMOTES_MISCELLANEOUS: {
      return true
    }
    default:
      return false
  }
}

const AssetBrowse = (props: Props) => {
  const {
    vendor,
    view,
    isMap,
    isFullscreen,
    address,
    contracts,
    onSetView,
    onFetchAssetsFromRoute,
    onBrowse,
    section,
    sections,
    assetType,
    onlyOnSale,
    onlySmart,
    viewInState,
    isRentalsEnabled
  } = props

  // Prevent fetching more than once while browsing
  const [hasFetched, setHasFetched] = useState(false)

  // Kick things off
  useEffect(() => {
    onSetView(view)
  }, [onSetView, view])

  // When the view changes, we unset the hasFetched flag
  useEffect(() => {
    if (view !== viewInState) {
      setHasFetched(false)
    }
  }, [view, viewInState])

  useEffect(() => {
    if (viewInState === view && !hasFetched) {
      onFetchAssetsFromRoute({
        vendor,
        view,
        section,
        address,
        contracts,
        onlyOnSale,
        onlySmart
      })
      setHasFetched(true)
    }
  }, [
    view,
    vendor,
    section,
    address,
    contracts,
    onlyOnSale,
    onlySmart,
    viewInState,
    onFetchAssetsFromRoute,
    hasFetched
  ])

  // Handlers
  const handleSetFullscreen = useCallback(
    () => onBrowse({ isMap: true, isFullscreen: true }),
    [onBrowse]
  )

  const hanldeBrowseItems = useCallback(
    () => onBrowse({ assetType: AssetType.ITEM }),
    [onBrowse]
  )

  const handleBrowse = useCallback(
    () => onBrowse({ assetType: AssetType.NFT }),
    [onBrowse]
  )

  const toggleBoxI18nKey = isAccountView(view) ? 'account_page' : 'browse_page'

  const left = (
    <>
      {!isAccountView(view) && !isLandSection(section) && (
        <ToggleBox
          className="result-type-toggle"
          header={t('filters.type')}
          items={[
            {
              title: t(`${toggleBoxI18nKey}.primary_market_title`),
              active: assetType === AssetType.ITEM,
              description: t(`${toggleBoxI18nKey}.primary_market_subtitle`),
              disabled:
                !hasPrimarySales(section) || vendor !== VendorName.DECENTRALAND,
              onClick: hanldeBrowseItems
            },
            {
              title: t(`${toggleBoxI18nKey}.secondary_market_title`),
              active:
                assetType === AssetType.NFT ||
                vendor !== VendorName.DECENTRALAND,
              description: t(`${toggleBoxI18nKey}.secondary_market_subtitle`),
              onClick: handleBrowse
            }
          ]}
        />
      )}
      <NotMobile>
        {view === View.ACCOUNT ? (
          <Suspense fallback={<Loader size="big" />}>
            <LazyAccountSidebar address={address!} />
          </Suspense>
        ) : view === View.CURRENT_ACCOUNT ? (
          <Suspense fallback={<Loader size="big" />}>
            <LazyAccountSidebar address={address!} isCurrentAccount />
          </Suspense>
        ) : (
          <Suspense fallback={<Loader size="big" />}>
            <LazyNFTSidebar section={section} sections={sections} />
          </Suspense>
        )}
      </NotMobile>
    </>
  )

  let right: ReactNode

  switch (section) {
    case DecentralandSection.COLLECTIONS:
      right = (
        <Suspense fallback={<Loader size="big" />}>
          <LazyCollectionList />
        </Suspense>
      )
      break
    case DecentralandSection.ON_SALE:
      right = (
        <Suspense fallback={<Loader size="big" />}>
          <LazyOnSaleList onSaleOrRentType={OnSaleOrRentType.SALE} />
        </Suspense>
      )
      break
    case DecentralandSection.ON_RENT:
      right = (
        <Suspense fallback={<Loader size="big" />}>
          <LazyOnSaleList onSaleOrRentType={OnSaleOrRentType.RENT} />
        </Suspense>
      )
      break
    case DecentralandSection.SALES:
      right = (
        <Suspense fallback={<Loader size="big" />}>
          <LazySales />
        </Suspense>
      )
      break
    case DecentralandSection.BIDS:
      right = (
        <Suspense fallback={<Loader size="big" />}>
          <LazyBids />
        </Suspense>
      )
      break
    case DecentralandSection.STORE_SETTINGS:
      right = (
        <Suspense fallback={<Loader size="big" />}>
          <LazyStoreSettings />
        </Suspense>
      )
      break
    default:
      right = (
        <>
          {isMap && isFullscreen ? (
            <div className="blur-background">
              <Container>
                <Suspense fallback={<Loader size="big" />}>
                  <LazyNFTFilters isMap={isMap} />
                </Suspense>
              </Container>
            </div>
          ) : (
            <Suspense fallback={<Loader size="big" />}>
              <LazyNFTFilters isMap={Boolean(isMap)} contracts={contracts} />
            </Suspense>
          )}
          {isMap ? (
            <div className="Atlas">
              <Suspense fallback={<Loader size="big" />}>
                <LazyAtlas withNavigation withPopup showOnSale={onlyOnSale} />
              </Suspense>
              <div
                className="fullscreen-button"
                onClick={handleSetFullscreen}
              />
            </div>
          ) : (
            <Suspense fallback={<Loader size="big" />}>
              <LazyAssetList
                isManager={view === View.CURRENT_ACCOUNT && isRentalsEnabled}
              />
            </Suspense>
          )}
        </>
      )
  }

  const mobileSections = [
    Sections.decentraland.COLLECTIONS,
    Sections.decentraland.LAND,
    Sections.decentraland.WEARABLES,
    Sections.decentraland.EMOTES,
    Sections.decentraland.ENS,
    Sections.decentraland.ON_SALE,
    isRentalsEnabled ? Sections.decentraland.ON_RENT : undefined,
    Sections.decentraland.SALES,
    Sections.decentraland.BIDS,
    Sections.decentraland.STORE_SETTINGS
  ].filter(Boolean)

  return (
    <>
      {view === View.CURRENT_ACCOUNT ? (
        <Mobile>
          <Tabs isFullscreen>
            <Tabs.Left>
              {mobileSections.map((value, key) => (
                <Tabs.Tab
                  key={key}
                  active={section === value}
                  onClick={() => onBrowse({ section: value })}
                >
                  {t(`menu.${value}`)}
                </Tabs.Tab>
              ))}
            </Tabs.Left>
          </Tabs>
        </Mobile>
      ) : null}
      <Page
        className={classNames('AssetBrowse', isMap && 'is-map')}
        isFullscreen={isFullscreen}
      >
        <Row>
          {!isFullscreen && (
            <Column align="left" className="sidebar">
              {left}
            </Column>
          )}
          <Column align="right" grow={true}>
            {right}
          </Column>
        </Row>
      </Page>
    </>
  )
}

export default React.memo(AssetBrowse)
