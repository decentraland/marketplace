export type Props = {
  address: string
  totalSales: number
  totalEarnings: string
  ethereumEarned: string
  maticEarned: string
  royalties: string
  isLoading: boolean
  onFetchMetrics: (address: string) => void
}

export type MapStateProps = Pick<
  Props,
  'address' | 'totalEarnings' | 'ethereumEarned' | 'isLoading' | 'maticEarned' | 'totalSales' | 'royalties'
>
export type MapDispatchProps = Pick<Props, 'onFetchMetrics'>
