import { connect } from 'react-redux'
import { getWallet, isConnecting } from '../../modules/wallet/selectors'
import { RootState } from '../../modules/reducer'
import ProtectedRoute from './ProtectedRoute'
import { MapStateProps } from './ProtectedRoute.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state),
    isConnecting: isConnecting(state)
  }
}

export default connect(mapState)(ProtectedRoute)
