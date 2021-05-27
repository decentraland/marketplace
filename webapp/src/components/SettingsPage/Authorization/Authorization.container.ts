import { connect } from 'react-redux'
import {
  getData as getAuthorizations,
  getLoading
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import {
  grantTokenRequest,
  revokeTokenRequest
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { RootState } from '../../../modules/reducer'
import { getPendingAuthorizationTransactions } from '../../../modules/transaction/selectors'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './Authorization.types'
import Authorization from './Authorization'

const mapState = (state: RootState): MapStateProps => ({
  authorizations: getAuthorizations(state),
  pendingTransactions: getPendingAuthorizationTransactions(state),
  loading: getLoading(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onGrant: authorization => dispatch(grantTokenRequest(authorization)),
  onRevoke: authorization => dispatch(revokeTokenRequest(authorization))
})

export default connect(mapState, mapDispatch)(Authorization)
