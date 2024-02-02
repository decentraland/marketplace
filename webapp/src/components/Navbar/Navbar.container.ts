import { connect } from 'react-redux'
import { push, getLocation } from 'connected-react-router'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import { TransactionStatus } from 'decentraland-dapps/dist/modules/transaction/types'
import { RootState } from '../../modules/reducer'
import { getTransactions } from '../../modules/transaction/selectors'
import { getWallet } from '../../modules/wallet/selectors'
import { getIsAuthDappEnabled } from '../../modules/features/selectors'
import { MapStateProps, MapDispatch, MapDispatchProps } from './Navbar.types'
import Navbar from './Navbar'

const mapState = (state: RootState): MapStateProps => ({
  wallet: getWallet(state),
  location: getLocation(state),
  hasPendingTransactions: getTransactions(
    state
  ).some((tx: { status: TransactionStatus | null }) => isPending(tx.status)),
  isAuthDappEnabled: getIsAuthDappEnabled(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(Navbar)
