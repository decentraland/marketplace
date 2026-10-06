export type Props = {
  page: number
  hasMorePages: boolean
  isLoading?: boolean
  maxScrollPages?: number
  /** Scroll container to observe the end of the list in. Defaults to the viewport. */
  root?: Element | null
  children: JSX.Element | null
  onLoadMore: (page: number) => void
}
