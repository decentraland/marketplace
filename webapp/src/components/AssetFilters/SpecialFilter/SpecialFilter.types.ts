export type Props = {
  isOnlySmart?: boolean
  withCredits?: boolean
  isCreditsEnabled?: boolean
  onSmartChange?: (value: boolean) => void
  onWithCreditsChange?: (value: boolean) => void
  'data-testid'?: string
  className?: string
  defaultCollapsed?: boolean
}

export type ContainerProps = Omit<Props, 'isOnlySmart' | 'withCredits' | 'isCreditsEnabled'>
