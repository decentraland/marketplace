import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Dispatch } from 'redux'
import { closeAllModals } from 'decentraland-dapps/dist/modules/modal/actions'
import { getCampaignTheme, getIsMaintenanceEnabled } from '../../modules/features/selectors'
import { RootState } from '../../modules/reducer'
import Routes from './Routes'
import { MapDispatchProps, MapStateProps } from './Routes.types'

const mapState = (state: RootState): MapStateProps => ({
  inMaintenance: getIsMaintenanceEnabled(state),
  campaignTheme: getCampaignTheme(state)
})

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onLocationChanged: () => dispatch(closeAllModals())
})

export default withRouter(connect(mapState, mapDispatch)(Routes))
