import { connect } from 'react-redux'
import { Dispatch, bindActionCreators } from 'redux'
import { RootState } from '../../../modules/reducer'
import { getWallet } from '../../../modules/wallet/selectors'
import { getCurrentOrder } from '../../../modules/order/selectors'
import { MapDispatchProps, MapStateProps } from './BuyWithCryptoModal.types'
import BuyWithCryptoModal from './BuyWithCryptoModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state),
    order: getCurrentOrder(state)
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps =>
  bindActionCreators(
    {
      onConfirm: () => {}
    },
    dispatch
  )

export default connect(mapState, mapDispatch)(BuyWithCryptoModal)
