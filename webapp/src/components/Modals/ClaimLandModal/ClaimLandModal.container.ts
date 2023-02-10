import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../../modules/reducer'
import { claimAssetRequest } from '../../../modules/rental/actions'
import { isClaimingAsset, isSubmittingTransaction, getError } from '../../../modules/rental/selectors'
import ClaimLandModal from './ClaimLandModal'
import { MapDispatchProps, MapStateProps, OwnProps } from './ClaimLandModal.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    isTransactionBeingConfirmed: isClaimingAsset(state),
    isSubmittingTransaction: isSubmittingTransaction(state),
    error: getError(state)
  }
}

const mapDispatch = (dispatch: Dispatch, ownProps: OwnProps): MapDispatchProps => {
  return {
    onSubmitTransaction: () => dispatch(claimAssetRequest(ownProps.metadata.nft, ownProps.metadata.rental))
  }
}

export default connect(mapState, mapDispatch)(ClaimLandModal)
