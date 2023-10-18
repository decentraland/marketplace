import { connect } from 'react-redux'
import { Dispatch, bindActionCreators } from 'redux'
import { RootState } from '../../../modules/reducer'
import { getWallet } from '../../../modules/wallet/selectors'
import { MapDispatchProps, MapStateProps } from './BuyWithCryptoModal.types'
import BuyWithCryptoModal from './BuyWithCryptoModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state)
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
