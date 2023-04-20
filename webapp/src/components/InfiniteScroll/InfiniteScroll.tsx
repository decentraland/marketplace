import { useCallback, useEffect, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button } from 'decentraland-ui'
import { Props } from './InfiniteScroll.types'

export function InfiniteScroll({
  hasMorePages,
  isLoading,
  children,
  maxInfiniteScrolls,
  onLoadMore
}: Props) {
  const [scrolledTimes, setScrolledTimes] = useState(0)

  const onScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight
    if (
      !isLoading &&
      scrollTop + clientHeight >= scrollHeight &&
      hasMorePages &&
      (!maxInfiniteScrolls || scrolledTimes < maxInfiniteScrolls)
    ) {
      setScrolledTimes(scrolledTimes + 1)
      onLoadMore()
    }
  }, [hasMorePages, isLoading, scrolledTimes, maxInfiniteScrolls, onLoadMore])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  const handleLoadMore = useCallback(() => {
    onLoadMore()
    setScrolledTimes(0)
  }, [onLoadMore])

  const showLoadMoreButton =
    !isLoading &&
    maxInfiniteScrolls !== undefined &&
    scrolledTimes === maxInfiniteScrolls

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
