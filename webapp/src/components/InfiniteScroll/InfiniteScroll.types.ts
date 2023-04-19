export type Props = {
  skip: number
  hasMorePages: boolean
  isLoading?: boolean
  maxScrollAssets?: number
  children: JSX.Element | null
  onLoadMore: (page: number) => void
}
