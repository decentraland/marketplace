import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../../modules/reducer'
import { CREATE_RENTAL_REQUEST } from '../../../modules/rental/actions'
import {
  getLoading as getRentalLoading,
  getError
} from '../../../modules/rental/selectors'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './CreateListingStep.types'
import CreateListingStep from './CreateListingStep'

const mapState = (state: RootState): MapStateProps => ({
  isCreatingRentalLising: isLoadingType(
    getRentalLoading(state),
    CREATE_RENTAL_REQUEST
  ),
  error: getError(state)
})

const mapDispatch = (_dispatch: MapDispatch): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(CreateListingStep)
