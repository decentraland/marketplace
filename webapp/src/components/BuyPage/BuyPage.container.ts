import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import {
  getData as getAuthorizations,
  getLoading as getLoadingAuthorizations
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import { RootState } from '../../modules/reducer'
import { executeOrderRequest, EXECUTE_ORDER_REQUEST } from '../../modules/order/actions'
import { getLoading as getLoadingOrders } from '../../modules/order/selectors'
import { MapStateProps, MapDispatchProps, MapDispatch } from './BuyPage.types'
import BuyPage from './BuyPage'
import { getWallet } from '../../modules/wallet/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { FETCH_AUTHORIZATIONS_REQUEST } from 'decentraland-dapps/dist/modules/authorization/actions'

const mapState = (state: RootState): MapStateProps => ({
  wallet: getWallet(state),
  authorizations: getAuthorizations(state),
  isLoading: isLoadingType(getLoadingAuthorizations(state), FETCH_AUTHORIZATIONS_REQUEST),
  isExecutingOrder: isLoadingType(getLoadingOrders(state), EXECUTE_ORDER_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onExecuteOrder: (order, nft, fingerprint) =>
    dispatch(executeOrderRequest(order, nft, fingerprint))
})

export default connect(mapState, mapDispatch)(BuyPage)
