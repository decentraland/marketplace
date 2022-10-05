export type Props = {
  isMVMFEnabled: boolean
  contractAddress: string
}

export type MapStateProps = Pick<Props, 'isMVMFEnabled'>
export type MapDispatchProps = {}
export type MapDispatch = {}
