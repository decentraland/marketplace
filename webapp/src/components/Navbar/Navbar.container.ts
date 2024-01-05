import { connect } from 'react-redux'
import { push, getLocation } from 'connected-react-router'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'

import { RootState } from '../../modules/reducer'
import { getTransactions } from '../../modules/transaction/selectors'
import { getIsAuthDappEnabled } from '../../modules/features/selectors'
import { MapStateProps, MapDispatch, MapDispatchProps } from './Navbar.types'
import Navbar from './Navbar'
import { getCurrentIdentity } from '../../modules/identity/selectors'

const mapState = (state: RootState): MapStateProps => ({
  location: getLocation(state),
  hasPendingTransactions: getTransactions(state).some(tx =>
    isPending(tx.status)
  ),
  identity: getCurrentIdentity(state) || undefined,
  isAuthDappEnabled: getIsAuthDappEnabled(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(Navbar)
