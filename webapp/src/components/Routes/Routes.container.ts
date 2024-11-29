import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Dispatch } from 'redux'
import { closeAllModals } from 'decentraland-dapps/dist/modules/modal/actions'
import { getIsMaintenanceEnabled } from '../../modules/features/selectors'
import { RootState } from '../../modules/reducer'
import { getWallet } from '../../modules/wallet/selectors'
import Routes from './Routes'
import { MapDispatchProps, MapStateProps } from './Routes.types'

const mapState = (state: RootState): MapStateProps => {
  const wallet = getWallet(state)
  return {
    inMaintenance: getIsMaintenanceEnabled(state),
    userWalletAddress: wallet?.address.toLowerCase() ?? null,
    userWalletType: wallet?.providerType ?? null
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onLocationChanged: () => dispatch(closeAllModals())
})

export default withRouter(connect(mapState, mapDispatch)(Routes))
