import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../../../modules/reducer'
import { clearRentalErrors, upsertRentalRequest, UPSERT_RENTAL_REQUEST } from '../../../../modules/rental/actions'
import { getLoading as getRentalLoading, getError } from '../../../../modules/rental/selectors'
import { UpsertRentalOptType } from '../../../../modules/rental/types'
import { MapStateProps, MapDispatchProps, MapDispatch } from './ConfirmationStep.types'
import ConfirmationStep from './ConfirmationStep'

const mapState = (state: RootState): MapStateProps => ({
  isSigning: isLoadingType(getRentalLoading(state), UPSERT_RENTAL_REQUEST),
  error: getError(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onCreate: (nft, pricePerDay, periods, expiresAt) =>
    dispatch(upsertRentalRequest(nft, pricePerDay, periods, expiresAt, UpsertRentalOptType.INSERT)),
  onClearRentalErros: () => dispatch(clearRentalErrors())
})

export default connect(mapState, mapDispatch)(ConfirmationStep)
