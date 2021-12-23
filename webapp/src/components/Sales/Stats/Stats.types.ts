export type Props = {
  address: string
  totalSales: number
  ethereumEarned: string
  maticEarned: string
  isLoading: boolean
  onFetchMetrics: (address: string) => void
}

export type MapStateProps = Pick<
  Props,
  'address' | 'ethereumEarned' | 'isLoading' | 'maticEarned' | 'totalSales'
>
export type MapDispatchProps = Pick<Props, 'onFetchMetrics'>
