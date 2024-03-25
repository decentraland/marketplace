import { connect } from 'react-redux'
import { push, getLocation } from 'connected-react-router'
import { TransactionStatus } from 'decentraland-dapps/dist/modules/transaction/types'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import { getIsChainSelectorEnabled } from '../../modules/features/selectors'
import { getCurrentIdentity } from '../../modules/identity/selectors'
import { RootState } from '../../modules/reducer'
import { getTransactions } from '../../modules/transaction/selectors'
import Navbar from './Navbar'
import { MapStateProps, MapDispatch, MapDispatchProps } from './Navbar.types'

const mapState = (state: RootState): MapStateProps => ({
  location: getLocation(state),
  hasPendingTransactions: getTransactions(state).some((tx: { status: TransactionStatus | null }) => isPending(tx.status)),
  identity: getCurrentIdentity(state) || undefined,
  isChainSelectorEnabled: getIsChainSelectorEnabled(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(Navbar)
