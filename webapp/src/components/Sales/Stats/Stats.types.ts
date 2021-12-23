export type Props = {
  totalSales: number
  ethereumEarned: string
  maticEarned: string
  isLoading: boolean
}

export type MapStateProps = Pick<
  Props,
  'ethereumEarned' | 'isLoading' | 'maticEarned' | 'totalSales'
>
