import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import {
  isConnected,
  isConnecting
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from '../../modules/reducer'
import { getTransactions } from '../../modules/transaction/selectors'
import { locations } from '../../modules/routing/locations'
import { openLogin } from '../../modules/login/actions'
import { getIsAuthDappEnabled } from '../../modules/features/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './UserInformation.types'
import UserMenu from './UserInformation'

const mapState = (state: RootState): MapStateProps => {
  return {
    isAuthDappEnabled: getIsAuthDappEnabled(state),
    isSignedIn: isConnected(state),
    isSigningIn: isConnecting(state),
    hasActivity: getTransactions(state).some(tx => isPending(tx.status))
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onClickActivity: () => dispatch(push(locations.activity())),
  onClickSettings: () => dispatch(push(locations.settings())),
  onClickMyAssets: () => dispatch(push(locations.defaultCurrentAccount())),
  onClickMyLists: () => dispatch(push(locations.lists())),
  onSignIn: () => dispatch(openLogin())
})

export default connect(mapState, mapDispatch)(UserMenu)
