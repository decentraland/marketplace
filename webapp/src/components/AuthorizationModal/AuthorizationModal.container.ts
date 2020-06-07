import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import {
  allowTokenRequest,
  approveTokenRequest
} from '../../modules/authorization/actions'
import {
  getAuthorizations,
  getPendingTransactions
} from '../../modules/authorization/selectors'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './AuthorizationModal.types'
import AuthorizationModal from './AuthorizationModal'

const mapState = (state: RootState): MapStateProps => ({
  authorizations: getAuthorizations(state),
  pendingTransactions: getPendingTransactions(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onAllow: (isAllowed, contractAddress, tokenAddress) =>
    dispatch(allowTokenRequest(isAllowed, contractAddress, tokenAddress)),
  onApprove: (isAllowed, contractAddress, tokenAddress) =>
    dispatch(approveTokenRequest(isAllowed, contractAddress, tokenAddress))
})

export default connect(mapState, mapDispatch)(AuthorizationModal)
