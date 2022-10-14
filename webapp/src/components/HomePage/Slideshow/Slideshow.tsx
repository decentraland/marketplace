import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { HeaderMenu, Header, Button, Loader } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { Asset } from '../../../modules/asset/types'
import { AssetCard } from '../../AssetCard'
import { Props } from './Slideshow.types'
import ItemsSection from './ItemsSection'
import './Slideshow.css'

const PAGE_SIZE = 4
const INITIAL_PAGE = 1

const Slideshow = (props: Props) => {
  const slideRef = useRef<HTMLDivElement>(null)
  const {
    view,
    title,
    subtitle,
    viewAllTitle,
    assets,
    isSubHeader,
    isLoading,
    hasItemsSection,
    onViewAll,
    onChangeItemSection
  } = props
  const [showArrows, setShowArrows] = useState(false)
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE)
  const [assetsToRender, setAssetsToRender] = useState(
    assets.slice(0, PAGE_SIZE)
  )
  const totalPages = useMemo(() => Math.ceil(assets.length / PAGE_SIZE), [
    assets.length
  ])

  useEffect(() => {
    const currentPosition = (currentPage - INITIAL_PAGE) * PAGE_SIZE
    setAssetsToRender(
      assets.slice(currentPosition, currentPosition + PAGE_SIZE)
    )
  }, [currentPage, assets, setAssetsToRender])

  const handleOnAssetCardClick = useCallback(
    (asset: Asset) => {
      getAnalytics().track('Asset click', {
        id: asset.id,
        section: title
      })
    },
    [title]
  )

  const renderNfts = useCallback(
    () =>
      assetsToRender.map(asset => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onClick={() => handleOnAssetCardClick(asset)}
        />
      )),
    [assetsToRender, handleOnAssetCardClick]
  )

  const handleOnNextPage = () => {
    setCurrentPage(
      currentPage + 1 > totalPages ? INITIAL_PAGE : currentPage + 1
    )
  }

  const handleOnPreviousPage = () => {
    setCurrentPage(currentPage - 1 === 0 ? totalPages : currentPage - 1)
  }

  const onMouseEnter = useCallback(() => setShowArrows(true), [])
  const onMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const contained =
        event.relatedTarget instanceof Node &&
        slideRef.current?.contains(event.relatedTarget as Node)
      if (!contained) {
        setShowArrows(false)
      }
    },
    []
  )

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
          <div>
            <Header sub={isSubHeader}>{title}</Header>
            <Header sub>{subtitle}</Header>
            {hasItemsSection ? (
              <ItemsSection
                view={view}
                viewAllButton={viewAllButton()}
                onChangeItemSection={onChangeItemSection!}
              />
            ) : null}
          </div>
        </HeaderMenu.Left>
        {!hasItemsSection ? (
          <HeaderMenu.Right>{viewAllButton()}</HeaderMenu.Right>
        ) : null}
      </HeaderMenu>
      <div className="assets">
        {isLoading ? (
          assets.length === 0 ? (
            <Loader active size="massive" />
          ) : (
            renderNfts()
          )
        ) : assets.length > 0 ? (
          renderNfts()
        ) : null}
      </div>
      <>
        <div
          className="arrow-container arrow-container-left"
          {...showArrowsHandlers}
        >
          {showArrows && (
            <Button
              circular
              secondary
              className="arrow-back"
              onClick={handleOnPreviousPage}
            >
              <i className="caret back" />
            </Button>
          )}
        </div>
        <div
          className="arrow-container arrow-container-right"
          {...showArrowsHandlers}
        >
          {showArrows && (
            <Button
              circular
              secondary
              className="arrow-forward"
              onClick={handleOnNextPage}
            >
              <i className="caret" />
            </Button>
          )}
        </div>
      </>

      <div className="page-indicators-container">
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            className="page-indicator-container"
            onClick={() => setCurrentPage(index + 1)}
          >
            <div
              className={`page-indicator ${
                currentPage === index + 1 ? 'active' : ''
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(Slideshow)
