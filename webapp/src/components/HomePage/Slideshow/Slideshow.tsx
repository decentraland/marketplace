import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import classNames from 'classnames'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { HeaderMenu, Header, Button, Loader, Empty, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { Asset } from '../../../modules/asset/types'
import * as events from '../../../utils/events'
import { AssetCard } from '../../AssetCard'
import ItemsSection from './ItemsSection'
import { Props } from './Slideshow.types'
import './Slideshow.css'

const DEFAULT_PAGE_SIZE = 5
const INITIAL_PAGE = 1

const Slideshow = (props: Props) => {
  const slideRef = useRef<HTMLDivElement>(null)
  const {
    view,
    title,
    subtitle,
    viewAllTitle,
    emptyMessage,
    assets,
    isSubHeader,
    isLoading,
    hasItemsSection,
    onViewAll,
    onChangeItemSection
  } = props
  const isMobileOrTablet = useTabletAndBelowMediaQuery()
  const pageSize = isMobileOrTablet ? assets.length : DEFAULT_PAGE_SIZE
  const [showArrows, setShowArrows] = useState(false)
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE)
  const [assetsToRender, setAssetsToRender] = useState(isMobileOrTablet ? assets : assets.slice(0, pageSize))

  const totalPages = useMemo(
    () => (isMobileOrTablet ? 1 : Math.ceil(assets.length / pageSize)),
    [assets.length, pageSize, isMobileOrTablet]
  )

  useEffect(() => {
    const currentPosition = (currentPage - INITIAL_PAGE) * pageSize
    setAssetsToRender(assets.slice(currentPosition, currentPosition + pageSize))
  }, [currentPage, assets, setAssetsToRender, pageSize])

  useEffect(() => {
    if (isMobileOrTablet && currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [isMobileOrTablet, currentPage])

  const handleOnAssetCardClick = useCallback(
    (asset: Asset) => {
      getAnalytics().track(events.ASSET_CLICK, {
        id: asset.id,
        section: title
      })
    },
    [title]
  )

  const renderNfts = useCallback(
    () => assetsToRender.map(asset => <AssetCard key={asset.id} asset={asset} onClick={() => handleOnAssetCardClick(asset)} />),
    [assetsToRender, handleOnAssetCardClick]
  )

  const renderEmptyState = () => (
    <Empty height={186} expand className="empty-state-container">
      <span>{emptyMessage ? emptyMessage : t('slideshow.empty_message')}</span>
    </Empty>
  )

  const handleOnNextPage = () => {
    setCurrentPage(currentPage + 1 > totalPages ? INITIAL_PAGE : currentPage + 1)
  }

  const handleOnPreviousPage = () => {
    setCurrentPage(currentPage - 1 === 0 ? totalPages : currentPage - 1)
  }

  const onMouseEnter = useCallback(() => setShowArrows(true), [])
  const onMouseLeave = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const contained = event.relatedTarget instanceof Node && slideRef.current?.contains(event.relatedTarget)
    if (!contained) {
      setShowArrows(false)
    }
  }, [])

  const viewAllButton = () => (
    <Button basic onClick={onViewAll}>
      {viewAllTitle ? viewAllTitle : t('slideshow.view_all')}
      <i className="caret" />
    </Button>
  )

  const showArrowsHandlers = { onMouseEnter, onMouseLeave }

  return (
    <div className="Slideshow" ref={slideRef} {...showArrowsHandlers}>
      <HeaderMenu>
        <HeaderMenu.Left>
          <div className="slideshow-header">
            <Header sub={isSubHeader}>{title}</Header>
            <Header sub>{subtitle}</Header>
            {hasItemsSection ? (
              <ItemsSection view={view} viewAllButton={viewAllButton()} onChangeItemSection={onChangeItemSection!} />
            ) : null}
          </div>
        </HeaderMenu.Left>
        {!hasItemsSection ? <HeaderMenu.Right>{viewAllButton()}</HeaderMenu.Right> : null}
      </HeaderMenu>
      <div className="assets-container">
        <div
          className={classNames('assets', {
            'full-width': assetsToRender.length === pageSize
          })}
        >
          {isLoading ? (
            assets.length === 0 ? (
              <Loader active size="massive" />
            ) : (
              renderNfts()
            )
          ) : assets.length > 0 ? (
            renderNfts()
          ) : (
            renderEmptyState()
          )}
        </div>
        <div className="arrow-container arrow-container-left" {...showArrowsHandlers}>
          {showArrows && totalPages > 1 && (
            <Button circular secondary className="arrow-back" onClick={handleOnPreviousPage}>
              <i className="caret back" />
            </Button>
          )}
        </div>
        <div className="arrow-container arrow-container-right" {...showArrowsHandlers}>
          {showArrows && totalPages > 1 && (
            <Button circular secondary className="arrow-forward" onClick={handleOnNextPage}>
              <i className="caret" />
            </Button>
          )}
        </div>
      </div>
      {totalPages > 1 ? (
        <div className="page-indicators-container">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div key={index} className="page-indicator-container" onClick={() => setCurrentPage(index + 1)}>
              <div className={`page-indicator ${currentPage === index + 1 ? 'active' : ''}`} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default React.memo(Slideshow)
