export type Props = {
  contractAddress: string | null
  currentAddress?: string
  onBack: () => void
}

export type MapStateProps = Pick<Props, 'contractAddress' | 'currentAddress'>
export type MapDispatchProps = Pick<Props, 'onBack'>
