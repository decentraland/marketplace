import { connect } from 'react-redux'
import { getLocation, push } from 'connected-react-router'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import {
  isConnected,
  isConnecting
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import { getIsFavoritesEnabled } from '../../modules/features/selectors'
import { getTransactions } from '../../modules/transaction/selectors'
import { locations } from '../../modules/routing/locations'
import { RootState } from '../../modules/reducer'
import UserMenu from './UserMenu'
import { MapStateProps, MapDispatch, MapDispatchProps } from './UserMenu.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    isSignedIn: isConnected(state),
    isSigningIn: isConnecting(state),
    isActivity: getLocation(state).pathname === locations.activity(),
    hasActivity: getTransactions(state).some(tx => isPending(tx.status)),
    isFavoritesEnabled: getIsFavoritesEnabled(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onClickActivity: () => dispatch(push(locations.activity())),
  onClickSettings: () => dispatch(push(locations.settings())),
  onClickMyAssets: () => dispatch(push(locations.defaultCurrentAccount())),
  onClickMyLists: () => dispatch(push(locations.defaultList()))
})

export default connect(mapState, mapDispatch)(UserMenu)
