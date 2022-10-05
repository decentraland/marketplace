import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { MapStateProps } from './Routes.types'
import {
  getIsMaintenanceEnabled,
  getIsMVMFEnabled
} from '../../modules/features/selectors'
import Routes from './Routes'
import { RootState } from '../../modules/reducer'

const mapState = (state: RootState): MapStateProps => ({
  inMaintenance: getIsMaintenanceEnabled(state),
  isMVMFEnabled: getIsMVMFEnabled(state)
})

const mapDispatch = (_: any) => ({})

export default withRouter(connect(mapState, mapDispatch)(Routes))
