export type Props = {
  currentAddress?: string
  contractAddress: string | null
  onBack: () => void
}

export type MapStateProps = Pick<Props, 'currentAddress' | 'contractAddress'>
export type MapDispatchProps = Pick<Props, 'onBack'>
