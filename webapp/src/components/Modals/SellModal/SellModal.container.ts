import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getContract } from '../../../modules/contract/selectors'
import { createOrderRequest, CREATE_ORDER_REQUEST, cancelOrderRequest, CANCEL_ORDER_REQUEST } from '../../../modules/order/actions'
import { getLoading as getLoadingOrders } from '../../../modules/order/selectors'
import { RootState } from '../../../modules/reducer'
import { getError } from '../../../modules/rental/selectors'
import { Contract } from '../../../modules/vendor/services'
import { getWallet } from '../../../modules/wallet/selectors'
import SellModal from './SellModal'
import { MapDispatch, MapDispatchProps, MapStateProps } from './SellModal.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state),
    error: getError(state),
    getContract: (query: Partial<Contract>) => getContract(state, query),
    isCreatingOrder: isLoadingType(getLoadingOrders(state), CREATE_ORDER_REQUEST),
    isCancelling: isLoadingType(getLoadingOrders(state), CANCEL_ORDER_REQUEST)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onCreateOrder: (nft, price, expiresAt, fingerprint) => dispatch(createOrderRequest(nft, price, expiresAt, fingerprint)),
  onCancelOrder: (order, nft, skipRedirection = false) => dispatch(cancelOrderRequest(order, nft, skipRedirection))
})

export default connect(mapState, mapDispatch)(SellModal)
