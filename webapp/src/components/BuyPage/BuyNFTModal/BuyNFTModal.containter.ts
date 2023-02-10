import { connect } from 'react-redux'
import { FETCH_AUTHORIZATIONS_REQUEST } from 'decentraland-dapps/dist/modules/authorization/actions'
import {
  getData as getAuthorizations,
  getLoading as getLoadingAuthorizations
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getContract } from '../../../modules/contract/selectors'
import { getIsBuyNftsWithFiatEnabled } from '../../../modules/features/selectors'
import { executeOrderRequest, executeOrderWithCardRequest, EXECUTE_ORDER_REQUEST } from '../../../modules/order/actions'
import { getLoading as getLoadingOrders } from '../../../modules/order/selectors'
import { RootState } from '../../../modules/reducer'
import { getIsBuyWithCardPage } from '../../../modules/routing/selectors'
import { Contract } from '../../../modules/vendor/services'
import BuyNFTModal from './BuyNFTModal'
import { MapStateProps, MapDispatchProps, MapDispatch } from './BuyNFTModal.types'

const mapState = (state: RootState): MapStateProps => ({
  authorizations: getAuthorizations(state),
  isLoading:
    isLoadingType(getLoadingAuthorizations(state), FETCH_AUTHORIZATIONS_REQUEST) ||
    isLoadingType(getLoadingOrders(state), EXECUTE_ORDER_REQUEST),
  isBuyNftsWithFiatEnabled: getIsBuyNftsWithFiatEnabled(state),
  isBuyWithCardPage: getIsBuyWithCardPage(state),
  getContract: (query: Partial<Contract>) => getContract(state, query)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onExecuteOrder: (order, nft, fingerprint) => dispatch(executeOrderRequest(order, nft, fingerprint)),
  onExecuteOrderWithCard: nft => dispatch(executeOrderWithCardRequest(nft))
})

export default connect(mapState, mapDispatch)(BuyNFTModal)
