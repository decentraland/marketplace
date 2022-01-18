import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { Container, Mobile, NotMobile, Page, Tabs } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { View } from '../../modules/ui/types'
import { Section as DecentralandSection } from '../../modules/vendor/decentraland'
import { AssetType } from '../../modules/asset/types'
import { VendorName } from '../../modules/vendor'
import { Section, Sections } from '../../modules/vendor/routing/types'
import { Atlas } from '../Atlas'
import { AccountSidebar } from '../AccountSidebar'
import { AssetList } from '../AssetList'
import { Row } from '../Layout/Row'
import { Column } from '../Layout/Column'
import { NFTFilters } from '../Vendor/NFTFilters'
import { NFTSidebar } from '../Vendor/NFTSidebar'
import { Props } from './AssetBrowse.types'
import { ToggleBox } from './ToggleBox'
import classNames from 'classnames'
import { isAccountView, isLandSection } from '../../modules/ui/utils'
import OnSaleList from '../OnSaleList'
import CollectionList from '../CollectionList'
import StoreSettings from '../StoreSettings'
import Sales from '../Sales'
import { Bids } from '../Bids'
import './AssetBrowse.css'

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
    case DecentralandSection.WEARABLES_TOP_HEAD: {
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
    onSetView,
    onFetchAssetsFromRoute,
    onBrowse,
    section,
    sections,
    assetType,
    onlyOnSale,
    viewInState
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
        onlyOnSale
      })
      setHasFetched(true)
    }
  }, [
    view,
    vendor,
    section,
    address,
    onlyOnSale,
    viewInState,
    onFetchAssetsFromRoute,
    hasFetched
  ])

  // handlers
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
          <AccountSidebar address={address!} />
        ) : view === View.CURRENT_ACCOUNT ? (
          <AccountSidebar address={address!} isCurrentAccount />
        ) : (
          <NFTSidebar section={section} sections={sections} />
        )}
      </NotMobile>
    </>
  )

  let right: ReactNode

  switch (section) {
    case DecentralandSection.COLLECTIONS:
      right = <CollectionList />
      break
    case DecentralandSection.ON_SALE:
      right = <OnSaleList />
      break
    case DecentralandSection.SALES:
      right = <Sales />
      break
    case DecentralandSection.BIDS:
      right = <Bids />
      break
    case DecentralandSection.STORE_SETTINGS:
      right = <StoreSettings />
      break
    default:
      right = (
        <>
          {isMap && isFullscreen ? (
            <div className="blur-background">
              <Container>
                <NFTFilters isMap={isMap} />
              </Container>
            </div>
          ) : (
            <NFTFilters isMap={Boolean(isMap)} />
          )}
          {isMap ? (
            <div className="Atlas">
              <Atlas withNavigation withPopup showOnSale={onlyOnSale} />
              <div
                className="fullscreen-button"
                onClick={handleSetFullscreen}
              />
            </div>
          ) : (
            <AssetList />
          )}
        </>
      )
  }

  const mobileSections = [
    Sections.decentraland.COLLECTIONS,
    Sections.decentraland.LAND,
    Sections.decentraland.WEARABLES,
    Sections.decentraland.ENS,
    Sections.decentraland.ON_SALE,
    Sections.decentraland.SALES,
    Sections.decentraland.BIDS,
    Sections.decentraland.STORE_SETTINGS
  ]

  return (
    <>
      {view === View.CURRENT_ACCOUNT ? (
        <Mobile>
          <Tabs isFullscreen>
            <Tabs.Left>
              {mobileSections.map(value => (
                <Tabs.Tab
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
