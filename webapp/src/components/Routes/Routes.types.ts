import { RouteComponentProps } from 'react-router-dom'
import { closeAllModals } from 'decentraland-dapps/dist/modules/modal/actions'
import { CampaignTheme } from '../../modules/features/campaignTheme'

export type Props = RouteComponentProps & {
  inMaintenance: boolean
  /** The seasonal skin to publish on the document root, or `null` for the ordinary purple. */
  campaignTheme: CampaignTheme | null
  onLocationChanged: typeof closeAllModals
}

export type MapStateProps = Pick<Props, 'inMaintenance' | 'campaignTheme'>
export type MapDispatchProps = Pick<Props, 'onLocationChanged'>

export type State = {
  hasError: boolean
  stackTrace: string
}
