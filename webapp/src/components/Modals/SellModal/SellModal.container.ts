import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getData as getAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { getWallet } from '../../../modules/wallet/selectors'
import {
  isSubmittingTransaction,
  getError,
  isAcceptingRental
} from '../../../modules/rental/selectors'
import { getContract } from '../../../modules/contract/selectors'
import { Contract } from '../../../modules/vendor/services'
import { createOrderRequest } from '../../../modules/order/actions'
import { MapDispatch, MapDispatchProps, MapStateProps } from './SellModal.types'
import SellModal from './SellModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state),
    isTransactionBeingConfirmed: isAcceptingRental(state),
    isSubmittingTransaction: isSubmittingTransaction(state),
    error: getError(state),
    getContract: (query: Partial<Contract>) => getContract(state, query),
    authorizations: getAuthorizations(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onCreateOrder: (nft, price, expiresAt) =>
    dispatch(createOrderRequest(nft, price, expiresAt))
})

export default connect(mapState, mapDispatch)(SellModal)
