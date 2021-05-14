import { connect } from 'react-redux'
import {
  grantTokenRequest,
  revokeTokenRequest
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { getData as getAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { RootState } from '../../modules/reducer'
import { getPendingAuthorizationTransactions } from '../../modules/transaction/selectors'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './AuthorizationModal.types'
import AuthorizationModal from './AuthorizationModal'

const mapState = (state: RootState): MapStateProps => ({
  authorizations: getAuthorizations(state),
  pendingTransactions: getPendingAuthorizationTransactions(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onGrant: authorization => dispatch(grantTokenRequest(authorization)),
  onRevoke: authorization => dispatch(revokeTokenRequest(authorization))
})

export default connect(mapState, mapDispatch)(AuthorizationModal)
