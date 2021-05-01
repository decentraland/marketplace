import { connect } from 'react-redux'
import {
  grantTokenRequest,
  revokeTokenRequest
} from 'decentraland-dapps/dist/modules/authorization/actions'
import {
  getData as getAuthorizations,
  getTransactions
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import { RootState } from '../../modules/reducer'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './AuthorizationModal.types'
import AuthorizationModal from './AuthorizationModal'

const mapState = (state: RootState): MapStateProps => ({
  authorizations: getAuthorizations(state),
  pendingTransactions: getTransactions(state).filter(tx => isPending(tx.status))
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onGrant: authorization => dispatch(grantTokenRequest(authorization)),
  onRevoke: authorization => dispatch(revokeTokenRequest(authorization))
})

export default connect(mapState, mapDispatch)(AuthorizationModal)
