import { connect } from 'react-redux'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { RootState } from '../../../modules/reducer'
import { getIsBuyWithCardPage } from '../../../modules/routing/selectors'
import PriceTooLow from './PriceTooLow'
import {
  MapDispatchProps,
  MapDispatch,
  MapStateProps
} from './PriceTooLow.types'

const mapState = (state: RootState): MapStateProps => ({
  isBuyWithCardPage: getIsBuyWithCardPage(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSwitchNetwork: chainId => dispatch(switchNetworkRequest(chainId))
})

export default connect(mapState, mapDispatch)(PriceTooLow)
