import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { getWallet, isConnecting } from '../../modules/wallet/selectors'
import { MapStateProps, MapDispatchProps, MapDispatch } from './Wallet.types'
import Wallet from './Wallet'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoading: isConnecting(state),
    wallet: getWallet(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(Wallet)
