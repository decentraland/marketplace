import { connect } from 'react-redux'
import {
  getData as getWalletData,
  isConnecting
} from 'decentraland-dapps/dist/modules/wallet/selectors'

import { getMarketSection } from '../../modules/ui/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './CurrentAccountPage.types'
import CurrentAccountPage from './CurrentAccountPage'
import { RootState } from '../../modules/reducer'

const mapState = (state: RootState): MapStateProps => ({
  section: getMarketSection(state),
  wallet: getWalletData(state),
  isConnecting: isConnecting(state)
})

const mapDispatch = (_: MapDispatch): MapDispatchProps => ({})

export default connect(
  mapState,
  mapDispatch
)(CurrentAccountPage)
