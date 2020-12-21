import { connect } from 'react-redux'
import { push, getLocation } from 'connected-react-router'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'

import { RootState } from '../../modules/reducer'
import { getTransactions } from '../../modules/transaction/selectors'
import { isConnected } from '../../modules/wallet/selectors'
import { MapStateProps, MapDispatch, MapDispatchProps } from './Navbar.types'
import Navbar from './Navbar'

const mapState = (state: RootState): MapStateProps => ({
  isConnected: isConnected(state),
  pathname: getLocation(state).pathname,
  hasPendingTransactions: getTransactions(state).some(tx =>
    isPending(tx.status)
  )
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(Navbar)
