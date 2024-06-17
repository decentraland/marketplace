import { RouteComponentProps } from 'react-router-dom'
import { Location } from 'history'

export type Props = RouteComponentProps & {
  inMaintenance: boolean
  onLocationChanged: (location: Location) => void
}

export type MapStateProps = Pick<Props, 'inMaintenance'>
export type MapDispatchProps = Pick<Props, 'onLocationChanged'>

export type State = {
  hasError: boolean
  stackTrace: string
}
