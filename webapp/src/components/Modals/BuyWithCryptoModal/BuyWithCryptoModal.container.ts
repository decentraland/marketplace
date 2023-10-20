import { connect } from 'react-redux'
import { Dispatch, bindActionCreators } from 'redux'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
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

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onConfirm: () => {},
  onSwitchNetwork: chainId => dispatch(switchNetworkRequest(chainId))
})
// const mapDispatch = (dispatch: Dispatch): MapDispatchProps =>
//   bindActionCreators(
//     {
//       onConfirm: () => {},
//       onSwitchNetwork: chainId => dispatch(switchNetworkRequest(chainId))
//     },
//     dispatch
//   )

export default connect(mapState, mapDispatch)(BuyWithCryptoModal)
