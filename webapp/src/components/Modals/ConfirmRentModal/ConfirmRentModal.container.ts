import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../../modules/reducer'
import { acceptRentalListingRequest } from '../../../modules/rental/actions'
import { getWallet } from '../../../modules/wallet/selectors'
import {
  isSubmittingTransaction,
  getError,
  isAcceptingRental
} from '../../../modules/rental/selectors'
import {
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './ConfirmRentModal.types'
import ConfirmRentModal from './ConfirmRentModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state),
    isTransactionBeingConfirmed: isAcceptingRental(state),
    isSubmittingTransaction: isSubmittingTransaction(state),
    error: getError(state)
  }
}

const mapDispatch = (
  dispatch: Dispatch,
  ownProps: OwnProps
): MapDispatchProps => {
  return {
    onSubmitTransaction: (addressOperator: string) =>
      dispatch(
        acceptRentalListingRequest(
          ownProps.metadata.nft,
          ownProps.metadata.rental,
          ownProps.metadata.selectedPeriodIndex,
          addressOperator
        )
      )
  }
}

export default connect(mapState, mapDispatch)(ConfirmRentModal)
