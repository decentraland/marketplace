import { connect } from 'react-redux'
import {
  fetchAuthorizationsRequest,
  GRANT_TOKEN_REQUEST,
  REVOKE_TOKEN_REQUEST
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { getData as getAuthorizations, getLoading } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { upsertContracts } from '../../../modules/contract/actions'
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
    authorizations: getAuthorizations(state),
    isCreatingOrder: isLoadingType(getLoadingOrders(state), CREATE_ORDER_REQUEST),
    isAuthorizing: isLoadingType(getLoading(state), GRANT_TOKEN_REQUEST) || isLoadingType(getLoading(state), REVOKE_TOKEN_REQUEST),
    isCancelling: isLoadingType(getLoading(state), CANCEL_ORDER_REQUEST)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onCreateOrder: (nft, price, expiresAt) => dispatch(createOrderRequest(nft, price, expiresAt)),
  onFetchAuthorizations: (authorizations: Authorization[]) => dispatch(fetchAuthorizationsRequest(authorizations)),
  onUpsertContracts: (contracts: Contract[]) => dispatch(upsertContracts(contracts)),
  onCancelOrder: (order, nft) => dispatch(cancelOrderRequest(order, nft))
})

export default connect(mapState, mapDispatch)(SellModal)
