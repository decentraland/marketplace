import React, { useCallback, useMemo, useEffect } from 'react'
import { Card, Loader } from 'decentraland-ui'
import { NFTCategory } from '@dcl/schemas'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { getCategoryFromSection } from '../../modules/routing/search'
import { getMaxQuerySize, MAX_PAGE } from '../../modules/vendor/api'
import { AssetType } from '../../modules/asset/types'
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
    isLoadingMore,
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
        return 'nft_list.simple_empty'
      }

      const isEmoteOrWearableSection = [
        NFTCategory.EMOTE,
        NFTCategory.WEARABLE
      ].includes(getCategoryFromSection(section)!)

      if (isEmoteOrWearableSection) {
        return search ? 'nft_list.empty_search' : 'nft_list.empty'
      }
    }
    return 'nft_list.simple_empty'
  }, [assets.length, search, section, isManager])

  return (
    <>
      {isLoading ? (
        <>
          <div className="overlay" />
          <Loader size="massive" active className="asset-loader" />
        </>
      ) : null}
      <Card.Group>
        {assets.length > 0 && (!isLoading || isLoadingMore)
          ? assets.map((assets, index) => (
              <AssetCard
                isManager={isManager}
                key={assetType + '-' + assets.id + '-' + index}
                asset={assets}
              />
            ))
          : null}
      </Card.Group>
      <InfiniteScroll
        page={page}
        hasMorePages={hasMorePages}
        onLoadMore={handleLoadMore}
        isLoading={isLoading}
        maxScrollPages={3}
      >
        {assets.length === 0 && !isLoading ? (
          <div className="empty">
            <div className="watermelon" />
            <T
              id={emptyStateTranslationString}
              values={{
                search,
                currentSection:
                  assetType === AssetType.ITEM
                    ? t('browse_page.primary_market_title').toLocaleLowerCase()
                    : t(
                        'browse_page.secondary_market_title'
                      ).toLocaleLowerCase(),
                section:
                  assetType === AssetType.ITEM
                    ? t(
                        'browse_page.secondary_market_title'
                      ).toLocaleLowerCase()
                    : t('browse_page.primary_market_title').toLocaleLowerCase(),
                searchStore: (chunks: string) => (
                  <button
                    className="empty-actions"
                    onClick={() =>
                      onBrowse({
                        assetType:
                          assetType === AssetType.ITEM
                            ? AssetType.NFT
                            : AssetType.ITEM
                      })
                    }
                  >
                    {chunks}
                  </button>
                ),
                'if-filters': (chunks: string) =>
                  hasFiltersEnabled ? chunks : '',
                clearFilters: (chunks: string) => (
                  <button className="empty-actions" onClick={onClearFilters}>
                    {chunks}
                  </button>
                ),
                br: () => <br />
              }}
            />
          </div>
        ) : null}
      </InfiniteScroll>
    </>
  )
}

export default React.memo(AssetList)
