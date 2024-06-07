import { RouteComponentProps } from 'react-router-dom'
import { closeAllModals } from 'decentraland-dapps/dist/modules/modal/actions'

export type Props = RouteComponentProps & {
  inMaintenance: boolean
  onLocationChanged: typeof closeAllModals
}

export type MapStateProps = Pick<Props, 'inMaintenance'>
export type MapDispatchProps = Pick<Props, 'onLocationChanged'>

export type State = {
  hasError: boolean
  stackTrace: string
}
