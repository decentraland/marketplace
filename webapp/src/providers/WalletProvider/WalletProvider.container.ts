import { connect } from 'react-redux'
import { connectWalletRequest } from '../../modules/wallet/actions'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './WalletProvider.types'
import WalletProvider from './WalletProvider'

const mapState = (_: any): MapStateProps => ({})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onConnect: () => dispatch(connectWalletRequest())
})

export default connect(mapState, mapDispatch)(WalletProvider) as any
