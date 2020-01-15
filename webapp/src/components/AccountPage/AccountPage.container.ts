import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import { RootState } from '../../modules/reducer'
import {
  fetchAccountRequest,
  FETCH_ACCOUNT_REQUEST
} from '../../modules/account/actions'
import { getLoading } from '../../modules/account/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './AccountPage.types'
import AccountPage from './AccountPage'

const mapState = (state: RootState): MapStateProps => ({
  isLoading: isLoadingType(getLoading(state), FETCH_ACCOUNT_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchAddres: (account: string) => dispatch(fetchAccountRequest(account))
})

export default connect(
  mapState,
  mapDispatch
)(AccountPage)
