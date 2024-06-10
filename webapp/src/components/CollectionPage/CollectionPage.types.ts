export type Props = {
  currentAddress?: string
  onBack: () => void
}

export type MapStateProps = Pick<Props, 'currentAddress'>
export type MapDispatchProps = Pick<Props, 'onBack'>
