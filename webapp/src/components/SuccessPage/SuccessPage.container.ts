import { connect } from 'react-redux'
import { push, getSearch } from 'connected-react-router'
import { getTransaction } from 'decentraland-dapps/dist/modules/transaction/selectors'
import { TransactionStatus } from 'decentraland-dapps/dist/modules/transaction/types'
import { RootState } from '../../modules/reducer'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './SuccessPage.types'
import { SuccessPage } from './SuccessPage'

const mapState = (state: RootState): MapStateProps => {
  const search = new URLSearchParams(getSearch(state))
  const transaction = getTransaction(state, search.get('txHash') || '')
  console.log(transaction)
  return {
    isLoading: Boolean(
      transaction && transaction.status !== TransactionStatus.CONFIRMED
    )
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: (path: string) => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(SuccessPage)
