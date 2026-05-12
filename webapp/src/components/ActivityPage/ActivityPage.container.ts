import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { clearTransactions } from 'decentraland-dapps/dist/modules/transaction/actions'
import { FETCH_USER_ACTIVITY_REQUEST, fetchUserActivityRequest } from '../../modules/activity/actions'
import { getError, getLoading, getMergedActivity } from '../../modules/activity/selectors'
import { RootState } from '../../modules/reducer'
import { getAddress } from '../../modules/wallet/selectors'
import ActivityPage from './ActivityPage'
import { MapStateProps, MapDispatchProps, MapDispatch } from './ActivityPage.types'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state),
  mergedActivity: getMergedActivity(state),
  loading: isLoadingType(getLoading(state), FETCH_USER_ACTIVITY_REQUEST),
  error: getError(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onClearHistory: address => dispatch(clearTransactions(address)),
  onLoadActivity: () => dispatch(fetchUserActivityRequest())
})

export default connect(mapState, mapDispatch)(ActivityPage)
