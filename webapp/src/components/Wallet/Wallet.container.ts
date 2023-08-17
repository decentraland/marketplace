import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { getWallet, isConnecting } from '../../modules/wallet/selectors'
import Wallet from './Wallet'
import { MapStateProps, MapDispatchProps, MapDispatch } from './Wallet.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoading: isConnecting(state),
    wallet: getWallet(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: (path) => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(Wallet)
