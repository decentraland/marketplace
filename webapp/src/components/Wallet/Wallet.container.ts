import { connect } from 'react-redux'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from '../../modules/reducer'
import { getWallet } from '../../modules/wallet/selectors'
import Wallet from './Wallet'
import { MapStateProps } from './Wallet.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoading: isConnecting(state),
    wallet: getWallet(state)
  }
}

export default connect(mapState)(Wallet)
