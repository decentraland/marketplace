import { RouteComponentProps } from 'react-router'

export type Props = RouteComponentProps & {
  inMaintenance: boolean
}

export type MapStateProps = Pick<Props, 'inMaintenance'>

export type State = {
  hasError: boolean
  stackTrace: string
}
