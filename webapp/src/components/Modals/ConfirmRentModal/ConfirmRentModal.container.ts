import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Contract } from '@dcl/schemas'
import { RootState } from '../../../modules/reducer'
import { acceptRentalListingRequest, clearRentalErrors } from '../../../modules/rental/actions'
import { getWallet } from '../../../modules/wallet/selectors'
import { isSubmittingTransaction, getError, isAcceptingRental } from '../../../modules/rental/selectors'
import { getContract } from '../../../modules/contract/selectors'
import { MapDispatchProps, MapStateProps, OwnProps } from './ConfirmRentModal.types'
import ConfirmRentModal from './ConfirmRentModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state),
    isTransactionBeingConfirmed: isAcceptingRental(state),
    isSubmittingTransaction: isSubmittingTransaction(state),
    error: getError(state),
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

const mapDispatch = (dispatch: Dispatch, ownProps: OwnProps): MapDispatchProps => {
  return {
    onSubmitTransaction: (addressOperator: string) =>
      dispatch(
        acceptRentalListingRequest(ownProps.metadata.nft, ownProps.metadata.rental, ownProps.metadata.selectedPeriodIndex, addressOperator)
      ),
    onClearRentalErrors: () => dispatch(clearRentalErrors())
  }
}

export default connect(mapState, mapDispatch)(ConfirmRentModal)
