export type Props = { 
  page: number,
  hasMorePages: boolean,
  isLoading?: boolean,
  maxScrollPages?: number,
  children: JSX.Element | null,
  onLoadMore: (page: number) => void
}
