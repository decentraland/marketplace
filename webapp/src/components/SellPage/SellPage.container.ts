import { connect } from 'react-redux'
import { Order } from '@dcl/schemas'
import { FETCH_AUTHORIZATIONS_REQUEST } from 'decentraland-dapps/dist/modules/authorization/actions'
import { getLoading as getLoadingAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getContract } from '../../modules/contract/selectors'
import { NFT } from '../../modules/nft/types'
import {
  createOrderRequest,
  CREATE_ORDER_REQUEST,
  clearOrderErrors,
  cancelOrderRequest,
  CANCEL_ORDER_REQUEST
} from '../../modules/order/actions'
import { getLoading as getLoadingOrders } from '../../modules/order/selectors'
import { RootState } from '../../modules/reducer'
import { Contract } from '../../modules/vendor/services'
import SellPage from './SellPage'
import { MapStateProps, MapDispatchProps, MapDispatch } from './SellPage.types'

const mapState = (state: RootState): MapStateProps => ({
  isLoading: isLoadingType(getLoadingAuthorizations(state), FETCH_AUTHORIZATIONS_REQUEST),
  isCreatingOrder: isLoadingType(getLoadingOrders(state), CREATE_ORDER_REQUEST),
  isLoadingCancelOrder: isLoadingType(getLoadingOrders(state), CANCEL_ORDER_REQUEST),
  getContract: (query: Partial<Contract>) => getContract(state, query)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onCreateOrder: (nft, price, expiresAt, fingerprint) => dispatch(createOrderRequest(nft, price, expiresAt, fingerprint)),
  onClearOrderErrors: () => dispatch(clearOrderErrors()),
  onCancelOrder: (order: Order, nft: NFT) => dispatch(cancelOrderRequest(order, nft, true))
})

export default connect(mapState, mapDispatch)(SellPage)
