import { RouteComponentProps } from 'react-router'

export type Props = RouteComponentProps & {
  inMaintenance: boolean
  isMVMFEnabled: boolean
}

export type MapStateProps = Pick<Props, 'inMaintenance' | 'isMVMFEnabled'>

export type State = {
  hasError: boolean
  stackTrace: string
}
