import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../../../modules/reducer'
import { upsertRentalRequest, UPSERT_RENTAL_REQUEST, removeRentalRequest } from '../../../../modules/rental/actions'
import { getLoading as getRentalLoading, getError, isRemovingRental, isSubmittingTransaction } from '../../../../modules/rental/selectors'
import { MapStateProps, MapDispatchProps, MapDispatch, OwnProps } from './EditConfirmationStep.types'
import ConfirmationStep from './EditConfirmationStep'
import { UpsertRentalOptType } from '../../../../modules/rental/types'

const mapState = (state: RootState): MapStateProps => ({
  isSigning: isLoadingType(getRentalLoading(state), UPSERT_RENTAL_REQUEST),
  isRemoveTransactionBeingConfirmed: isRemovingRental(state),
  isSubmittingRemoveTransaction: isSubmittingTransaction(state),
  error: getError(state)
})

const mapDispatch = (dispatch: MapDispatch, ownProps: OwnProps): MapDispatchProps => ({
  onRemove: () => dispatch(removeRentalRequest(ownProps.nft)),
  onEdit: (nft, pricePerDay, periods, expiresAt) =>
    dispatch(upsertRentalRequest(nft, pricePerDay, periods, expiresAt, UpsertRentalOptType.EDIT))
})

export default connect(mapState, mapDispatch)(ConfirmationStep)
