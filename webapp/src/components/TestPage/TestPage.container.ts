import { connect } from 'react-redux'

import { RootState } from '../../modules/reducer'
import { MapStateProps, MapDispatch, MapDispatchProps } from './TestPage.types'
import TestPage from './TestPage'
import { sendMANARequest } from '../../modules/test/actions'
import { getTransactions } from 'decentraland-dapps/dist/modules/transaction/selectors'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'

const mapState = (state: RootState): MapStateProps => ({
  transactions: getTransactions(state, getAddress(state)!)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSend: (address, amount) => dispatch(sendMANARequest(address, amount))
})

export default connect(mapState, mapDispatch)(TestPage)
