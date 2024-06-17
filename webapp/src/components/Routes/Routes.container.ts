import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Location } from 'history'
import { Dispatch } from 'redux'
import { closeAllModals } from 'decentraland-dapps/dist/modules/modal/actions'
import { getIsMaintenanceEnabled } from '../../modules/features/selectors'
import { RootState } from '../../modules/reducer'
import { locationChanged } from '../../modules/routing/actions'
import Routes from './Routes'
import { MapDispatchProps, MapStateProps } from './Routes.types'

const mapState = (state: RootState): MapStateProps => ({
  inMaintenance: getIsMaintenanceEnabled(state)
})

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onLocationChanged: (location: Location) => {
    dispatch(closeAllModals())
    dispatch(locationChanged(location))
  }
})

export default withRouter(connect(mapState, mapDispatch)(Routes))
