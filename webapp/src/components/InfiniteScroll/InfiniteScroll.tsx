import { useCallback, useEffect, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button } from 'decentraland-ui'
import { Props } from './InfiniteScroll.types'
import { PAGE_SIZE } from '../../modules/vendor/api'

export function InfiniteScroll({
  skip,
  hasMorePages,
  isLoading,
  children,
  maxScrollAssets,
  onLoadMore
}: Props) {
  const [scrollAssets, setScrollPage] = useState(0)
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(
    maxScrollAssets === 0
  )

  const onScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight
    if (
      !isLoading &&
      scrollTop + clientHeight >= scrollHeight &&
      hasMorePages &&
      (!maxScrollAssets || scrollAssets < maxScrollAssets)
    ) {
      setScrollPage(scrollAssets + 1)
      onLoadMore(skip + PAGE_SIZE)
    }
  }, [skip, hasMorePages, isLoading, scrollAssets, maxScrollAssets, onLoadMore])

  useEffect(() => {
    if (
      !isLoading &&
      maxScrollAssets !== undefined &&
      scrollAssets === maxScrollAssets
    ) {
      setShowLoadMoreButton(true)
    } else {
      setShowLoadMoreButton(false)
    }
  }, [isLoading, scrollAssets, maxScrollAssets, skip, setShowLoadMoreButton])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  const handleLoadMore = useCallback(() => {
    onLoadMore(skip + PAGE_SIZE)
    setScrollPage(0)
  }, [onLoadMore, skip])

  if (!hasMorePages) {
    return children
  }

  return (
    <div role="feed">
      {children}
      {showLoadMoreButton && (
        <div className="load-more">
          <Button loading={isLoading} inverted primary onClick={handleLoadMore}>
            {t('global.load_more')}
          </Button>
        </div>
      )}
    </div>
  )
}
