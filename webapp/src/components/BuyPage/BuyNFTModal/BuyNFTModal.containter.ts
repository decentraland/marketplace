import { connect } from 'react-redux'
import { getLoading as getLoadingAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { FETCH_AUTHORIZATIONS_REQUEST } from 'decentraland-dapps/dist/modules/authorization/actions'
import { RootState } from '../../../modules/reducer'
import { executeOrderRequest, executeOrderWithCardRequest, EXECUTE_ORDER_REQUEST, clearOrderErrors } from '../../../modules/order/actions'
import { getLoading as getLoadingOrders } from '../../../modules/order/selectors'
import { getContract } from '../../../modules/contract/selectors'
import { Contract } from '../../../modules/vendor/services'
import { getIsBuyWithCardPage } from '../../../modules/routing/selectors'
import { MapStateProps, MapDispatchProps, MapDispatch } from './BuyNFTModal.types'
import BuyNFTModal from './BuyNFTModal'

const mapState = (state: RootState): MapStateProps => ({
  isLoading:
    isLoadingType(getLoadingAuthorizations(state), FETCH_AUTHORIZATIONS_REQUEST) ||
    isLoadingType(getLoadingOrders(state), EXECUTE_ORDER_REQUEST),
  isBuyWithCardPage: getIsBuyWithCardPage(state),
  getContract: (query: Partial<Contract>) => getContract(state, query)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onExecuteOrder: (order, nft, fingerprint, silent) => dispatch(executeOrderRequest(order, nft, fingerprint, silent)),
  onExecuteOrderWithCard: nft => dispatch(executeOrderWithCardRequest(nft)),
  onClearOrderErrors: () => dispatch(clearOrderErrors())
})

export default connect(mapState, mapDispatch)(BuyNFTModal)
