import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../../modules/reducer'
import { removeRentalRequest } from '../../../modules/rental/actions'
import { isRemovingRental, isSubmittingTransaction, getError } from '../../../modules/rental/selectors'
import ClaimLandModal from './RemoveRentalModal'
import { MapDispatchProps, MapStateProps, OwnProps } from './RemoveRentalModal.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    isTransactionBeingConfirmed: isRemovingRental(state),
    isSubmittingTransaction: isSubmittingTransaction(state),
    error: getError(state)
  }
}

const mapDispatch = (dispatch: Dispatch, ownProps: OwnProps): MapDispatchProps => {
  return {
    onSubmitTransaction: () => dispatch(removeRentalRequest(ownProps.metadata.nft))
  }
}

export default connect(mapState, mapDispatch)(ClaimLandModal)
