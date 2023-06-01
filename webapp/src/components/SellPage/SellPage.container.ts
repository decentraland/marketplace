import { connect } from 'react-redux'
import { goBack } from 'connected-react-router'
import { FETCH_AUTHORIZATIONS_REQUEST } from 'decentraland-dapps/dist/modules/authorization/actions'
import {
  getLoading as getLoadingAuthorizations
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../modules/reducer'
import {
  createOrderRequest,
  CREATE_ORDER_REQUEST,
  clearOrderErrors
} from '../../modules/order/actions'
import { getLoading as getLoadingOrders } from '../../modules/order/selectors'
import { getContract } from '../../modules/contract/selectors'
import { Contract } from '../../modules/vendor/services'
import { MapStateProps, MapDispatchProps, MapDispatch } from './SellPage.types'
import SellPage from './SellPage'

const mapState = (state: RootState): MapStateProps => ({
  isLoading: isLoadingType(
    getLoadingAuthorizations(state),
    FETCH_AUTHORIZATIONS_REQUEST
  ),
  isCreatingOrder: isLoadingType(getLoadingOrders(state), CREATE_ORDER_REQUEST),
  getContract: (query: Partial<Contract>) => getContract(state, query)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onGoBack: () => dispatch(goBack()),
  onCreateOrder: (nft, price, expiresAt) =>
    dispatch(createOrderRequest(nft, price, expiresAt)),
  onClearOrderErrors: () => dispatch(clearOrderErrors()),
})

export default connect(mapState, mapDispatch)(SellPage)
