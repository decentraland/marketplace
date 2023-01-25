import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import {
  getIsMaintenanceEnabled,
  getIsBuyNftsWithFiatEnabled
} from '../../modules/features/selectors'
import { RootState } from '../../modules/reducer'
import Routes from './Routes'
import { MapStateProps } from './Routes.types'

const mapState = (state: RootState): MapStateProps => ({
  inMaintenance: getIsMaintenanceEnabled(state),
  isBuyNftsWithFiatEnabled: getIsBuyNftsWithFiatEnabled(state)
})

const mapDispatch = (_: any) => ({})

export default withRouter(connect(mapState, mapDispatch)(Routes))
