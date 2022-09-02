export type Props = {
  userAddress?: string
  isConnecting: boolean
  onBack: (location?: string) => void
}

export type MapStateProps = Pick<Props, 'userAddress' | 'isConnecting'>
export type MapDispatchProps = Pick<Props, 'onBack'>
