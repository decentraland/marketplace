import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import {
  OwnProps,
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './EditPriceAndBeneficiaryModal.types'
import EditPriceAndBeneficiaryModal from './EditPriceAndBeneficiaryModal'
import { RootState } from '../../modules/reducer'
import {
  FETCH_ITEMS_REQUEST,
  setPriceAndBeneficiaryRequest,
  SET_PRICE_AND_BENEFICIARY_REQUEST
} from '../../modules/item/actions'
import { getLoading } from '../../modules/item/selectors'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  return {
    item: ownProps.item,
    isLoading:
      isLoadingType(getLoading(state), FETCH_ITEMS_REQUEST) ||
      isLoadingType(getLoading(state), SET_PRICE_AND_BENEFICIARY_REQUEST)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSetPriceAndBeneficiary: (itemId, price, beneficiary) =>
    dispatch(setPriceAndBeneficiaryRequest(itemId, price, beneficiary))
})

export default connect(mapState, mapDispatch)(EditPriceAndBeneficiaryModal)
