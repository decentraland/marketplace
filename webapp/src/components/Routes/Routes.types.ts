import { RouteComponentProps } from 'react-router-dom'
import { ProviderType } from '@dcl/schemas'
import { closeAllModals } from 'decentraland-dapps/dist/modules/modal/actions'

export type Props = RouteComponentProps & {
  inMaintenance: boolean
  userWalletAddress: string | null
  userWalletType: ProviderType | null
  onLocationChanged: typeof closeAllModals
}

export type MapStateProps = Pick<Props, 'inMaintenance' | 'userWalletAddress' | 'userWalletType'>
export type MapDispatchProps = Pick<Props, 'onLocationChanged'>

export type State = {
  hasError: boolean
  stackTrace: string
}
