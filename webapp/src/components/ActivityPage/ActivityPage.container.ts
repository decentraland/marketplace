import { connect } from 'react-redux'
import { clearTransactions } from 'decentraland-dapps/dist/modules/transaction/actions'

import { RootState } from '../../modules/reducer'
import { getAddress } from '../../modules/wallet/selectors'
import { getTransactions } from '../../modules/transaction/selectors'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './ActivityPage.types'
import ActivityPage from './ActivityPage'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state),
  transactions: getTransactions(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onClearHistory: address => dispatch(clearTransactions(address))
})

export default connect(mapState, mapDispatch)(ActivityPage)
