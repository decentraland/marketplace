import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import {
  getData as getWalletData,
  isConnecting
} from 'decentraland-dapps/dist/modules/wallet/selectors'

import { getUISection } from '../../modules/ui/selectors'
import { RootState } from '../../modules/reducer'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './CurrentAccountPage.types'
import CurrentAccountPage from './CurrentAccountPage'

const mapState = (state: RootState): MapStateProps => ({
  section: getUISection(state),
  wallet: getWalletData(state),
  isConnecting: isConnecting(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(
  mapState,
  mapDispatch
)(CurrentAccountPage)
