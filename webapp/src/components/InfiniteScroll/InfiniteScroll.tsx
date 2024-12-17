import { useEffect, useRef } from 'react'
import { Props } from './InfiniteScroll.types'

export function InfiniteScroll({ page, hasMorePages, isLoading, children, onLoadMore }: Props) {
  const bottomRef = useRef(null)

  useEffect(() => {
    if (isLoading) return // don't observe while loading more

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries
        if (entry.isIntersecting && hasMorePages) {
          onLoadMore(page + 1)
        }
      },
      {
        root: null, // the viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when the sentinel is in view
      }
    )

    if (bottomRef.current) {
      observer.observe(bottomRef.current)
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current)
      }
    }
  }, [page, hasMorePages, isLoading, onLoadMore])

  return (
    <div role="feed">
      {children}
      {hasMorePages && <div ref={bottomRef} style={{ height: '1px' }} />}
    </div>
  )
}
