import { connect } from 'react-redux'
import {
  isConnecting,
  isConnected
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from '../../modules/reducer'
import { getIsAuthDappEnabled } from '../../modules/features/selectors'
import { MapStateProps } from './SignInPage.types'
import SignInPage from './SignInPage'

const mapState = (state: RootState): MapStateProps => {
  return {
    isAuthDappEnabled: getIsAuthDappEnabled(state),
    isConnecting: isConnecting(state),
    isConnected: isConnected(state)
  }
}

export default connect(mapState)(SignInPage)
