import { useCallback, useEffect, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button } from 'decentraland-ui'
import { Props } from './InfiniteScroll.types'

export function InfiniteScroll({
  page,
  hasMorePages,
  isLoading,
  children,
  maxScrollPages,
  onLoadMore
}: Props) {
  const [scrollPage, setScrollPage] = useState(0)
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(
    maxScrollPages === 0
  )

  const onScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight
    if (
      !isLoading &&
      scrollTop + clientHeight >= scrollHeight &&
      hasMorePages &&
      (!maxScrollPages || scrollPage < maxScrollPages)
    ) {
      setScrollPage(scrollPage + 1)
      onLoadMore(page + 1)
    }
  }, [page, hasMorePages, isLoading, scrollPage, maxScrollPages, onLoadMore])

  useEffect(() => {
    if (!isLoading && maxScrollPages !== undefined && scrollPage === maxScrollPages) {
      setShowLoadMoreButton(true)
    } else {
      setShowLoadMoreButton(false)
    }
  }, [isLoading, scrollPage, maxScrollPages, page, setShowLoadMoreButton])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  const handleLoadMore = useCallback(() => {
    onLoadMore(page + 1)
    setScrollPage(0)
  }, [onLoadMore, page])

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
