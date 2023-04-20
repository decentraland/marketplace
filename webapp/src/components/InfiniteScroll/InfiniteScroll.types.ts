export type Props = {
  hasMorePages: boolean
  isLoading?: boolean
  maxInfiniteScrolls?: number
  children: JSX.Element | null
  onLoadMore: () => void
}
