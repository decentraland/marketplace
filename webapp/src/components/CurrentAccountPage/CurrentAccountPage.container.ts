import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { getWallet, isConnecting } from '../../modules/wallet/selectors'
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
  wallet: getWallet(state),
  isConnecting: isConnecting(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(CurrentAccountPage)
