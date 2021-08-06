import React, { useCallback, useEffect, useState } from 'react'
import { Container, Page, Responsive } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { View } from '../../modules/ui/types'
import { Section } from '../../modules/vendor/decentraland'
import { AssetType } from '../../modules/asset/types'
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
    case Section.WEARABLES:
    case Section.WEARABLES_HEAD:
    case Section.WEARABLES_EYEBROWS:
    case Section.WEARABLES_EYES:
    case Section.WEARABLES_FACIAL_HAIR:
    case Section.WEARABLES_HAIR:
    case Section.WEARABLES_MOUTH:
    case Section.WEARABLES_UPPER_BODY:
    case Section.WEARABLES_LOWER_BODY:
    case Section.WEARABLES_FEET:
    case Section.WEARABLES_ACCESORIES:
    case Section.WEARABLES_EARRING:
    case Section.WEARABLES_EYEWEAR:
    case Section.WEARABLES_HAT:
    case Section.WEARABLES_HELMET:
    case Section.WEARABLES_MASK:
    case Section.WEARABLES_TIARA:
    case Section.WEARABLES_TOP_HEAD: {
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
                  disabled: !hasPrimarySales(section),
                  onClick: hanldeBrowseItems
                },
                {
                  title: t(
                    view === View.ACCOUNT
                      ? 'account_page.secondary_market_title'
                      : 'browse_page.secondary_market_title'
                  ),
                  active: assetType === AssetType.NFT,
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
