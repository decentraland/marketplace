import React, { useCallback, useEffect, useState } from 'react'
import { Container, Page, Responsive } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { View } from '../../modules/ui/types'
import { Section as DecentralandSection } from '../../modules/vendor/decentraland'
import { AssetType } from '../../modules/asset/types'
import { VendorName } from '../../modules/vendor'
import { Section } from '../../modules/vendor/routing/types'
import { Atlas } from '../Atlas'
import { AccountSidebar } from '../AccountSidebar'
import { AssetList } from '../AssetList'
import { VendorStrip } from '../VendorStrip'
import { Row } from '../Layout/Row'
import { Column } from '../Layout/Column'
import { NFTFilters } from '../Vendor/NFTFilters'
import { NFTSidebar } from '../Vendor/NFTSidebar'
import { Props } from './AssetBrowse.types'
import { ToggleBox } from './ToggleBox'
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
    case DecentralandSection.WEARABLES_ACCESORIES:
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

  // classes
  let classes = ['AssetBrowse']
  if (isMap) {
    classes.push('is-map')
  }

  return (
    <Page className={classes.join(' ')} isFullscreen={isFullscreen}>
      <Row>
        {isFullscreen ? null : (
          <Column align="left" className="sidebar">
            <ToggleBox
              className="result-type-toggle"
              header={t('filters.type')}
              items={[
                {
                  title: t(
                    view === View.ACCOUNT
                      ? 'account_page.primary_market_title'
                      : 'browse_page.primary_market_title'
                  ),
                  active: assetType === AssetType.ITEM,
                  description: t(
                    view === View.ACCOUNT
                      ? 'account_page.primary_market_subtitle'
                      : 'browse_page.primary_market_subtitle'
                  ),
                  disabled:
                    !hasPrimarySales(section) ||
                    vendor !== VendorName.DECENTRALAND,
                  onClick: hanldeBrowseItems
                },
                {
                  title: t(
                    view === View.ACCOUNT
                      ? 'account_page.secondary_market_title'
                      : 'browse_page.secondary_market_title'
                  ),
                  active:
                    assetType === AssetType.NFT ||
                    vendor !== VendorName.DECENTRALAND,
                  description: t(
                    view === View.ACCOUNT
                      ? 'account_page.secondary_market_subtitle'
                      : 'browse_page.secondary_market_subtitle'
                  ),
                  onClick: handleBrowse
                }
              ]}
            />
            <Responsive minWidth={Responsive.onlyTablet.minWidth}>
              {view === View.ACCOUNT ? (
                <AccountSidebar address={address!} />
              ) : (
                <NFTSidebar section={section} sections={sections} />
              )}
            </Responsive>
          </Column>
        )}

        <Column align="right" grow={true}>
          {view === View.ACCOUNT && !isFullscreen ? (
            <VendorStrip address={address!} />
          ) : null}
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
        </Column>
      </Row>
    </Page>
  )
}

export default React.memo(AssetBrowse)
