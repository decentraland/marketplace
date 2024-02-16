import { connect } from 'react-redux'
import {
  isConnecting,
  isConnected
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from '../../modules/reducer'
import { MapStateProps } from './SignInPage.types'
import SignInPage from './SignInPage'

const mapState = (state: RootState): MapStateProps => {
  return {
    isConnecting: isConnecting(state),
    isConnected: isConnected(state)
  }
}

export default connect(mapState)(SignInPage)
