import React, { useCallback, useMemo, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NFTCategory } from '@dcl/schemas'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { Card, Loader } from 'decentraland-ui'
import { locations } from '../../modules/routing/locations'
import { getCategoryFromSection } from '../../modules/routing/search'
import { getMaxQuerySize, MAX_PAGE } from '../../modules/vendor/api'
import * as events from '../../utils/events'
import { AssetCard } from '../AssetCard'
import { InfiniteScroll } from '../InfiniteScroll'
import { getLastVisitedElementId } from './utils'
import { Props } from './AssetList.types'
import './AssetList.css'

const AssetList = (props: Props) => {
  const {
    vendor,
    section,
    assetType,
    assets,
    page,
    count,
    search,
    isLoading,
    hasFiltersEnabled,
    visitedLocations,
    onBrowse,
    isManager,
    onClearFilters
  } = props

  const location = useLocation()

  useEffect(() => {
    if (visitedLocations.length > 1) {
      const [currentLocation, previousLocation] = visitedLocations
      const elementId = getLastVisitedElementId(currentLocation?.pathname, previousLocation?.pathname)
      if (elementId) {
        document.getElementById(elementId)?.scrollIntoView()
      }
    }
    // only run effect on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLoadMore = useCallback(
    newPage => {
      onBrowse({ page: newPage })
      getAnalytics().track(events.LOAD_MORE, { page: newPage })
    },
    [onBrowse]
  )
  const maxQuerySize = getMaxQuerySize(vendor)

  const hasMorePages = (assets.length !== count || count === maxQuerySize) && page <= MAX_PAGE

  const emptyStateTranslationString = useMemo(() => {
    if (assets.length > 0) {
      return ''
    } else if (section) {
      if (isManager) {
        return 'nft_list.empty'
      }

      const isEmoteOrWearableSection = [NFTCategory.EMOTE, NFTCategory.WEARABLE].includes(getCategoryFromSection(section)!)

      if (location.pathname === locations.campaign()) {
        return 'nft_list.empty_campaign'
      }

      if (isEmoteOrWearableSection) {
        return search ? 'nft_list.empty_search' : 'nft_list.empty'
      }
    }
    return 'nft_list.empty'
  }, [assets.length, search, section, isManager, location])

  const renderEmptyState = useCallback(() => {
    return (
      <div className="empty empty-assets">
        <div className="watermelon" />
        <span className="empty-text">
          {t(`${emptyStateTranslationString}.title`, {
            search
          })}
        </span>
        <span>
          <T
            id={`${emptyStateTranslationString}.action`}
            values={{
              search,
              'if-filters': (chunks: string) => (hasFiltersEnabled ? chunks : ''),
              clearFilters: (chunks: string) => (
                <button className="empty-actions" onClick={onClearFilters}>
                  {chunks}
                </button>
              ),
              collectiblesLink: (chunks: string) => (
                <Link className="empty-actions" to={locations.browse()}>
                  {chunks}
                </Link>
              )
            }}
          />
        </span>
      </div>
    )
  }, [emptyStateTranslationString, hasFiltersEnabled, onClearFilters, search])

  const shouldRenderEmptyState = useMemo(() => assets.length === 0 && !isLoading, [assets.length, isLoading])

  const renderAssetCards = useCallback(
    () => assets.map((assets, index) => <AssetCard isManager={isManager} key={assetType + '-' + assets.id + '-' + index} asset={assets} />),
    [assetType, assets, isManager]
  )

  return (
    <div className="AssetsList">
      {isLoading ? (
        <>
          <div className="overlay" />
          <div className="transparentOverlay">
            <Loader size="massive" active className="asset-loader" />
          </div>
        </>
      ) : null}
      {assets.length > 0 ? <Card.Group> {renderAssetCards()} </Card.Group> : null}
      <InfiniteScroll page={page} hasMorePages={hasMorePages} onLoadMore={handleLoadMore} isLoading={isLoading} maxScrollPages={3}>
        {shouldRenderEmptyState ? renderEmptyState() : null}
      </InfiniteScroll>
    </div>
  )
}

export default React.memo(AssetList)
