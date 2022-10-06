export type Props = {
  isMVMFEnabled: boolean
  contract: string
}

export type MapStateProps = Pick<Props, 'isMVMFEnabled'>
export type MapDispatchProps = {}
export type MapDispatch = {}
