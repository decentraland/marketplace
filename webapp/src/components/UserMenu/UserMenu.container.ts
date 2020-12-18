import { connect } from 'react-redux'
import { getLocation, push } from 'connected-react-router'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import {
  getAddress,
  getMana,
  isConnected,
  isConnecting
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import {
  connectWalletRequest,
  disconnectWallet
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { getData as getProfiles } from 'decentraland-dapps/dist/modules/profile/selectors'
import { getTransactions } from '../../modules/transaction/selectors'
import { RootState } from '../../modules/reducer'
import { MapStateProps, MapDispatch, MapDispatchProps } from './UserMenu.types'
import UserMenu from './UserMenu'

const mapState = (state: RootState): MapStateProps => {
  const address = getAddress(state)
  return {
    address,
    mana: getMana(state),
    profile: getProfiles(state)[address!],
    isLoggedIn: isConnected(state),
    isLoggingIn: isConnecting(state),
    pathname: getLocation(state).pathname,
    hasPendingTransactions: getTransactions(state).some(tx =>
      isPending(tx.status)
    )
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onLogout: () => dispatch(disconnectWallet()),
  onLogin: () => dispatch(connectWalletRequest()),
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(UserMenu)
