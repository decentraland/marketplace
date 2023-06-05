import React, { useCallback, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Loader } from 'decentraland-ui'
import { NFTCategory } from '@dcl/schemas'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { getCategoryFromSection } from '../../modules/routing/search'
import { getMaxQuerySize, MAX_PAGE } from '../../modules/vendor/api'
import { Section } from '../../modules/vendor/decentraland'
import { locations } from '../../modules/routing/locations'
import * as events from '../../utils/events'
import { InfiniteScroll } from '../InfiniteScroll'
import { AssetCard } from '../AssetCard'
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

  useEffect(() => {
    if (visitedLocations.length > 1) {
      const [currentLocation, previousLocation] = visitedLocations
      const elementId = getLastVisitedElementId(
        currentLocation?.pathname,
        previousLocation?.pathname
      )
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

  const hasMorePages =
    (assets.length !== count || count === maxQuerySize) && page <= MAX_PAGE

  const emptyStateTranslationString = useMemo(() => {
    if (assets.length > 0) {
      return ''
    } else if (section) {
      if (isManager) {
        return 'nft_list.empty'
      }

      const isEmoteOrWearableSection = [
        NFTCategory.EMOTE,
        NFTCategory.WEARABLE
      ].includes(getCategoryFromSection(section)!)

      if (isEmoteOrWearableSection) {
        return search ? 'nft_list.empty_search' : 'nft_list.empty'
      }
    }
    return 'nft_list.empty'
  }, [assets.length, search, section, isManager])

  const renderEmptyState = useCallback(() => {
    if (section === Section.LISTS) {
      return (
        <div className="empty empty-list">
          <div className="logo"></div>
          <h1 className="title">{t('list_page.empty.title')}</h1>
          <p className="subtitle">{t('list_page.empty.subtitle')}</p>
          <Button primary as={Link} to={locations.browse()}>
            {t('list_page.empty.action')}
          </Button>
        </div>
      )
    }

    return (
      <div className="empty empty-assets">
        <div className="watermelon" />
        <span>
          {t(`${emptyStateTranslationString}.title`, {
            search
          })}
        </span>
        <span>
          <T
            id={`${emptyStateTranslationString}.action`}
            values={{
              search,
              'if-filters': (chunks: string) =>
                hasFiltersEnabled ? chunks : '',
              clearFilters: (chunks: string) => (
                <button className="empty-actions" onClick={onClearFilters}>
                  {chunks}
                </button>
              )
            }}
          />
        </span>
      </div>
    )
  }, [
    emptyStateTranslationString,
    hasFiltersEnabled,
    onClearFilters,
    search,
    section
  ])

  const shouldRenderEmptyState = useMemo(
    () => assets.length === 0 && !isLoading,
    [assets.length, isLoading]
  )

  const renderAssetCards = useCallback(
    () =>
      assets.map((assets, index) => (
        <AssetCard
          isManager={isManager}
          key={assetType + '-' + assets.id + '-' + index}
          asset={assets}
        />
      )),
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
      {assets.length > 0 ? (
        <Card.Group> {renderAssetCards()} </Card.Group>
      ) : null}
      <InfiniteScroll
        page={page}
        hasMorePages={hasMorePages}
        onLoadMore={handleLoadMore}
        isLoading={isLoading}
        maxScrollPages={3}
      >
        {shouldRenderEmptyState ? renderEmptyState() : null}
      </InfiniteScroll>
    </div>
  )
}

export default React.memo(AssetList)
