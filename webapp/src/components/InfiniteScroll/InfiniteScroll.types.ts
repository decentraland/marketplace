export type Props = {
  page: number
  hasMorePages: boolean
  isLoading?: boolean
  maxScrollPages?: number
  /** Scroll container to observe the end of the list in. Defaults to the viewport. */
  root?: Element | null
  /** Margin around the root to start loading before the end of the list is visible. */
  rootMargin?: string
  children: JSX.Element | null
  onLoadMore: (page: number) => void
}
