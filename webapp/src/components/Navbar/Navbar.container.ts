import { connect } from 'react-redux'
import { push, getLocation } from 'connected-react-router'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import { TransactionStatus } from 'decentraland-dapps/dist/modules/transaction/types'

import { RootState } from '../../modules/reducer'
import { getTransactions } from '../../modules/transaction/selectors'
import { MapStateProps, MapDispatch, MapDispatchProps } from './Navbar.types'
import Navbar from './Navbar'
import { getCurrentIdentity } from '../../modules/identity/selectors'
import { getIsChainSelectorEnabled } from '../../modules/features/selectors'

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
