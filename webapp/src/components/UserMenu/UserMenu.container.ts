import { connect } from 'react-redux'
import { getLocation, push } from 'connected-react-router'
import { UserMenu } from 'decentraland-dapps/dist/containers'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import { isConnected, isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from '../../modules/reducer'
import { locations } from '../../modules/routing/locations'
import { getTransactions } from '../../modules/transaction/selectors'
import { MapStateProps, MapDispatch, MapDispatchProps } from './UserMenu.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    isSignedIn: isConnected(state),
    isSigningIn: isConnecting(state),
    isActivity: getLocation(state).pathname === locations.activity(),
    hasActivity: getTransactions(state).some(tx => isPending(tx.status))
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onClickActivity: () => dispatch(push(locations.activity())),
  onClickSettings: () => dispatch(push(locations.settings()))
})

export default connect(mapState, mapDispatch)(UserMenu)
