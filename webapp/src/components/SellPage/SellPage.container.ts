import { connect } from 'react-redux'
import { goBack, push } from 'connected-react-router'
import { FETCH_AUTHORIZATIONS_REQUEST } from 'decentraland-dapps/dist/modules/authorization/actions'
import {
  getData as getAuthorizations,
  getLoading as getLoadingAuthorizations
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../modules/reducer'
import {
  createOrderRequest,
  CREATE_ORDER_REQUEST
} from '../../modules/order/actions'
import { getLoading as getLoadingOrders } from '../../modules/order/selectors'
import { getIsRentalsEnabled } from '../../modules/features/selectors'
import { MapStateProps, MapDispatchProps, MapDispatch } from './SellPage.types'
import SellPage from './SellPage'

const mapState = (state: RootState): MapStateProps => ({
  authorizations: getAuthorizations(state),
  isLoading: isLoadingType(
    getLoadingAuthorizations(state),
    FETCH_AUTHORIZATIONS_REQUEST
  ),
  isCreatingOrder: isLoadingType(getLoadingOrders(state), CREATE_ORDER_REQUEST),
  isRentalsEnabled: getIsRentalsEnabled(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onGoBack: () => dispatch(goBack()),
  onCreateOrder: (nft, price, expiresAt) =>
    dispatch(createOrderRequest(nft, price, expiresAt))
})

export default connect(mapState, mapDispatch)(SellPage)
