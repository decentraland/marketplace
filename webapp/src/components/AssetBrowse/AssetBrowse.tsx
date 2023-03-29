import React, { ReactNode, useEffect, useState } from 'react'
import { matchPath } from 'react-router-dom'
import classNames from 'classnames'
import { Container, Mobile, NotMobile, Page, Tabs } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { View } from '../../modules/ui/types'
import { Section as DecentralandSection } from '../../modules/vendor/decentraland'
import { Sections } from '../../modules/vendor/routing/types'
import { BrowseOptions } from '../../modules/routing/types'
import {
  getPersistedIsMapProperty,
  isAccountView
} from '../../modules/ui/utils'
import { locations } from '../../modules/routing/locations'
import { AccountSidebar } from '../AccountSidebar'
import { AssetList } from '../AssetList'
import { Row } from '../Layout/Row'
import { Column } from '../Layout/Column'
import AssetTopbar from '../AssetTopbar'
import { NFTSidebar } from '../Vendor/NFTSidebar'
import { OnSaleOrRentType } from '../OnSaleOrRentList/OnSaleOrRentList.types'
import OnSaleList from '../OnSaleOrRentList'
import CollectionList from '../CollectionList'
import StoreSettings from '../StoreSettings'
import Sales from '../Sales'
import { Bids } from '../Bids'
import { BackToTopButton } from '../BackToTopButton'
import { Props } from './AssetBrowse.types'
import MapTopbar from './MapTopbar'
import MapBrowse from './MapBrowse'
import './AssetBrowse.css'

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
    onlyOnSale,
    onlySmart,
    viewInState,
    onlyOnRent,
    visitedLocations,
    isMapViewFiltersEnabled
  } = props

  // Prevent fetching more than once while browsing
  const [hasFetched, setHasFetched] = useState(false)
  const isCurrentAccount = view === View.CURRENT_ACCOUNT
  const [showOwnedLandOnMap, setShowOwnedLandOnMap] = useState(true)

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

  const isMapPropertyPersisted = getPersistedIsMapProperty()

  useEffect(() => {
    if (
      section === DecentralandSection.LAND &&
      !isAccountView(view) &&
      isMapPropertyPersisted === false &&
      isMap
    ) {
      // To prevent the map view from being displayed when the user clicks on the Land navigation tab.
      // We set the has fetched variable to false so it has to browse back to the list view.
      setHasFetched(false)
    }
  }, [section, view, isMap, isMapPropertyPersisted])

  useEffect(() => {
    if (viewInState === view && !hasFetched) {
      // Options used to fetch the assets.
      const browseOpts: BrowseOptions = {
        vendor,
        view,
        section,
        address,
        contracts,
        onlyOnSale,
        onlySmart
      }

      // Function used to fetch the assets.
      let fetchAssetsFn: (opts: BrowseOptions) => void = onFetchAssetsFromRoute

      if (
        section === DecentralandSection.LAND &&
        !isAccountView(view) &&
        isMapPropertyPersisted === false
      ) {
        const previousPageIsLandDetail = !!matchPath(
          visitedLocations[1]?.pathname,
          { path: locations.nft(), strict: true, exact: true }
        )
        // Update the browser options to match the ones persisted.
        browseOpts.isMap = isMap
        browseOpts.isFullscreen = isFullscreen
        browseOpts.onlyOnSale =
          (!onlyOnSale && onlyOnRent === false && !previousPageIsLandDetail) ||
          (onlyOnSale === undefined &&
            onlyOnRent === undefined &&
            !previousPageIsLandDetail) ||
          onlyOnSale

        // We also set the fetch function as onBrowse because we need the url to be updated.
        fetchAssetsFn = onBrowse
      }
      fetchAssetsFn(browseOpts)

      setHasFetched(true)
    }
  }, [
    isMap,
    isFullscreen,
    view,
    vendor,
    section,
    address,
    contracts,
    onlyOnSale,
    onlySmart,
    viewInState,
    onFetchAssetsFromRoute,
    hasFetched,
    onlyOnRent,
    onBrowse,
    isMapPropertyPersisted,
    visitedLocations
  ])

  const left = (
    <>
      <NotMobile>
        {view === View.ACCOUNT || isCurrentAccount ? (
          <AccountSidebar
            address={address!}
            isCurrentAccount={isCurrentAccount}
          />
        ) : (
          <NFTSidebar section={section} sections={sections} />
        )}
      </NotMobile>
    </>
  )

  let right: ReactNode

  const mapTopbar = isMapViewFiltersEnabled ? (
    <MapTopbar
      showOwned={showOwnedLandOnMap}
      onShowOwnedChange={(show: boolean) => setShowOwnedLandOnMap(show)}
    />
  ) : (
    <div className="blur-background">
      <Container>
        <AssetTopbar />
      </Container>
    </div>
  )

  switch (section) {
    case DecentralandSection.COLLECTIONS:
      right = <CollectionList />
      break
    case DecentralandSection.ON_SALE:
      right = (
        <OnSaleList
          address={address}
          isCurrentAccount={isCurrentAccount}
          onSaleOrRentType={OnSaleOrRentType.SALE}
        />
      )
      break
    case DecentralandSection.ON_RENT:
      right = (
        <OnSaleList
          address={address}
          isCurrentAccount={isCurrentAccount}
          onSaleOrRentType={OnSaleOrRentType.RENT}
        />
      )
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
          {isMap && isFullscreen ? mapTopbar : <AssetTopbar />}
          {isMap ? (
            <MapBrowse showOwned={showOwnedLandOnMap} />
          ) : (
            <AssetList isManager={view === View.CURRENT_ACCOUNT} />
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
    Sections.decentraland.ON_RENT,
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
      <BackToTopButton />
    </>
  )
}

export default React.memo(AssetBrowse)
