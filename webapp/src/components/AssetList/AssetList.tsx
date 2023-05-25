import React, { useCallback, useMemo, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import InfiniteLoader from 'react-window-infinite-loader'
import AutoSizer from 'react-virtualized-auto-sizer'
import {
  FixedSizeGrid,
  FixedSizeGrid as Grid,
  GridChildComponentProps,
  GridOnItemsRenderedProps
} from 'react-window'
import { Button, Card, Loader, useMobileMediaQuery } from 'decentraland-ui'
import { NFTCategory } from '@dcl/schemas'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { getCategoryFromSection } from '../../modules/routing/search'
import { Section } from '../../modules/vendor/decentraland'
import { locations } from '../../modules/routing/locations'
import * as events from '../../utils/events'
import { AssetCard } from '../AssetCard'
import { getLastVisitedElementId } from './utils'
import { Props } from './AssetList.types'
import './AssetList.css'

const GUTTER_SIZE = 6
const CARD_MIN_WIDTH = 260
const CARD_HEIGHT = 360

const AssetList = (props: Props) => {
  const {
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

  const isMobile = useMobileMediaQuery()

  const handleScroll = useCallback(
    (gridRef: FixedSizeGrid<any> | null, cardsPerRow: number) => {
      if (visitedLocations.length > 1) {
        const [currentLocation, previousLocation] = visitedLocations
        const elementId = getLastVisitedElementId(
          currentLocation?.pathname,
          previousLocation?.pathname
        )
        if (elementId && cardsPerRow && gridRef) {
          const elementIndex = assets.findIndex(asset => asset.id === elementId)
          const elementRow = Math.floor(elementIndex / cardsPerRow)
          const elementColumn = elementIndex % cardsPerRow
          gridRef.scrollToItem({
            align: 'center',
            columnIndex: elementColumn,
            rowIndex: elementRow
          })
        }
      }
    },
    [assets, visitedLocations]
  )

  const handleLoadMore = useCallback(
    newPage => {
      onBrowse({ page: newPage })
      getAnalytics().track(events.LOAD_MORE, { page: newPage })
    },
    [onBrowse]
  )

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
        <div className="empty">
          <div className="logo"></div>
          <h1 className="title">{t('my_lists.empty.title')}</h1>
          <p className="subtitle">{t('my_lists.empty.subtitle')}</p>
          <Button primary as={Link} to={locations.browse()}>
            {t('my_lists.empty.action')}
          </Button>
        </div>
      )
    }

    // const currentSection =
    //   assetType === AssetType.ITEM
    //     ? t('browse_page.primary_market_title').toLocaleLowerCase()
    //     : t('browse_page.secondary_market_title').toLocaleLowerCase()
    // const alternativeSection =
    //   assetType === AssetType.ITEM
    //     ? t('browse_page.secondary_market_title').toLocaleLowerCase()
    //     : t('browse_page.primary_market_title').toLocaleLowerCase()
    return (
      <div className="empty empty-assets">
        <div className="watermelon" />
        <span>
          {t(`${emptyStateTranslationString}.title`, {
            search
            // currentSection
          })}
        </span>
        <span>
          <T
            id={`${emptyStateTranslationString}.action`}
            values={{
              search,
              // currentSection,
              // section: alternativeSection,
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

  const EXTRA_SPACE_FOR_SHADOW = 26
  const EXTRA_SPACE_TOP_FOR_SHADOW = 24

  const VirtualizedCard = useCallback(
    ({
      columnIndex,
      rowIndex,
      style,
      cardsPerRow
    }: GridChildComponentProps & { cardsPerRow: number }) => {
      const asset = assets[rowIndex * cardsPerRow + columnIndex]
      return asset ? (
        <div
          style={{
            ...style,
            padding: GUTTER_SIZE,
            paddingLeft: columnIndex === 0 ? 0 : GUTTER_SIZE,
            paddingRight: isMobile && columnIndex === 1 ? 0 : GUTTER_SIZE,
            left: +(style.left ?? 0) + EXTRA_SPACE_FOR_SHADOW,
            top: +(style.top ?? 0) + EXTRA_SPACE_TOP_FOR_SHADOW
          }}
        >
          <AssetCard
            key={assetType + '-' + asset.id}
            asset={asset}
            isManager={isManager}
          />
        </div>
      ) : null
    },
    [assetType, assets, isManager, isMobile]
  )

  const promiseOfLoadingMore = useRef<(() => void) | null>()

  /** The loadMoreItems fn needs to return a promise that is resolved when the load more finishes
   to do so, we store a promise that resolves when the `isLoading` turns from true to false */
  useEffect(() => {
    if (!isLoading && promiseOfLoadingMore.current) {
      promiseOfLoadingMore.current()
      promiseOfLoadingMore.current = null // resets the ref
    }
  }, [isLoading])

  const loadMoreItems = useCallback(() => {
    handleLoadMore(page + 1)
    return new Promise<void>(res => {
      promiseOfLoadingMore.current = res
    })
  }, [handleLoadMore, page])

  const getCardsDimensions = useCallback(
    (width: number) => {
      const CARDS_PER_ROW_MOBILE = 2
      const CARD_HEIGHT_MOBILE = 345
      if (isMobile) {
        console.log('width * 0.5: ', width * 0.5)
        return {
          cardsPerRow: CARDS_PER_ROW_MOBILE,
          cardWidth: width * 0.5,
          cardHeight: CARD_HEIGHT_MOBILE
        }
      }
      const quotient = Math.floor(width / CARD_MIN_WIDTH)
      const reminder = width % CARD_MIN_WIDTH
      const dimensions = {
        cardsPerRow: quotient,
        cardWidth: CARD_MIN_WIDTH + reminder / quotient,
        cardHeight: CARD_HEIGHT
      }
      return dimensions
    },
    [isMobile]
  )

  const isItemLoaded = useCallback(
    (index: number) => {
      const hasNextPage = count && assets.length < count
      return !hasNextPage || index < assets.length
    },
    [assets.length, count]
  )

  const renderAssetCards = useCallback(
    () => (
      <AutoSizer>
        {({ height, width }) => {
          if (!height || !width) return null
          const { cardsPerRow, cardWidth } = getCardsDimensions(width)
          const rowCount = Math.ceil(assets.length / cardsPerRow)
          const threshold = cardsPerRow // 1 row more

          return (
            !!height &&
            !!width && (
              <InfiniteLoader
                threshold={threshold}
                isItemLoaded={isItemLoaded}
                itemCount={count || 10000}
                loadMoreItems={loadMoreItems}
              >
                {({ onItemsRendered, ref }) => {
                  const newOnItemsRendered = (
                    props: GridOnItemsRenderedProps
                  ) => {
                    const {
                      overscanRowStartIndex,
                      overscanRowStopIndex,
                      visibleRowStopIndex,
                      visibleRowStartIndex
                    } = props
                    const params = {
                      overscanStartIndex: Math.ceil(
                        overscanRowStartIndex * cardsPerRow
                      ),
                      overscanStopIndex: Math.ceil(
                        (overscanRowStopIndex + 1) * cardsPerRow
                      ),
                      visibleStartIndex: Math.ceil(
                        visibleRowStartIndex * cardsPerRow
                      ),
                      visibleStopIndex: Math.ceil(
                        (visibleRowStopIndex + 1) * cardsPerRow
                      )
                    }
                    onItemsRendered(params)
                  }
                  return (
                    <Grid
                      className="grid"
                      ref={elemRef => {
                        ref(elemRef)
                        handleScroll(elemRef, cardsPerRow)
                      }}
                      height={height}
                      width={width + EXTRA_SPACE_FOR_SHADOW * 2}
                      columnCount={cardsPerRow}
                      columnWidth={cardWidth}
                      rowCount={rowCount}
                      rowHeight={CARD_HEIGHT + GUTTER_SIZE * 2}
                      onItemsRendered={newOnItemsRendered}
                      style={{
                        position: 'absolute',
                        left: -EXTRA_SPACE_FOR_SHADOW
                      }}
                    >
                      {props => (
                        <VirtualizedCard cardsPerRow={cardsPerRow} {...props} />
                      )}
                    </Grid>
                  )
                }}
              </InfiniteLoader>
            )
          )
        }}
      </AutoSizer>
    ),
    [
      VirtualizedCard,
      assets.length,
      count,
      getCardsDimensions,
      handleScroll,
      isItemLoaded,
      loadMoreItems
    ]
  )

  const DEFAULT_FOOTER_SIZE = 56
  const footerHeight =
    document.querySelector('ui.container.dcl.footer')?.getBoundingClientRect()
      .height || DEFAULT_FOOTER_SIZE

  const [assetListTopOffset, setAssetListTopOffset] = useState(0)

  return (
    <div
      ref={ref => {
        const rect = ref?.getBoundingClientRect()
        rect && setAssetListTopOffset(rect.top)
        !isMobile &&
          window.addEventListener('scroll', () => {
            const rect = ref?.getBoundingClientRect()
            rect && setAssetListTopOffset(rect.top)
          })
      }}
      className="AssetsList"
      style={{
        height: `calc(100vh - ${assetListTopOffset +
          (isMobile ? 0 : footerHeight)}px)`
      }}
    >
      {isLoading ? (
        <>
          <div className="overlay" />
          <div className="transparentOverlay">
            <Loader size="massive" active className="asset-loader" />
          </div>
        </>
      ) : null}
      {assets.length > 0 && assetListTopOffset ? (
        <Card.Group> {renderAssetCards()} </Card.Group>
      ) : shouldRenderEmptyState ? (
        renderEmptyState()
      ) : null}
    </div>
  )
}

export default React.memo(AssetList)
