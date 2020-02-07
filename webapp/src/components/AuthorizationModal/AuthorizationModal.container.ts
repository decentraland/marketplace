import { RootState } from '../../modules/reducer'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './AuthorizationModal.types'
import {
  allowTokenRequest,
  approveTokenRequest
} from '../../modules/authorization/actions'
import { connect } from 'react-redux'
import AuthorizationModal from './AuthorizationModal'
import { getPendingTransactions } from '../../modules/authorization/selectors'

const mapState = (state: RootState): MapStateProps => {
  return {
    pendingTransactions: getPendingTransactions(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onAllow: (isAllowed, contractAddress, tokenAddress) =>
    dispatch(allowTokenRequest(isAllowed, contractAddress, tokenAddress)),
  onApprove: (isAllowed, contractAddress, tokenAddress) =>
    dispatch(approveTokenRequest(isAllowed, contractAddress, tokenAddress))
})

export default connect(mapState, mapDispatch)(AuthorizationModal)
