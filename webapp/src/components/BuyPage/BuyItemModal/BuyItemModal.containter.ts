import { connect } from 'react-redux'
import {
  getData as getAuthorizations,
  getLoading as getLoadingAuthorizations
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import { FETCH_AUTHORIZATIONS_REQUEST } from 'decentraland-dapps/dist/modules/authorization/actions'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../../modules/reducer'
import { buyItemRequest, BUY_ITEM_REQUEST } from '../../../modules/item/actions'
import { getLoading as getItemsLoading } from '../../../modules/item/selectors'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './BuyItemModal.types'
import BuyItemModal from './BuyItemModal'

const mapState = (state: RootState): MapStateProps => ({
  authorizations: getAuthorizations(state),
  isLoading:
    isLoadingType(
      getLoadingAuthorizations(state),
      FETCH_AUTHORIZATIONS_REQUEST
    ) || isLoadingType(getItemsLoading(state), BUY_ITEM_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBuyItem: item => dispatch(buyItemRequest(item))
})
export default connect(mapState, mapDispatch)(BuyItemModal)
