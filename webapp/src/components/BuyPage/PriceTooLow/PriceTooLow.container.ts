import { connect } from 'react-redux'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { RootState } from '../../../modules/reducer'
import { getIsBuyNftsWithFiatEnabled } from '../../../modules/features/selectors'
import { getIsBuyWithCardPage } from '../../../modules/routing/selectors'
import PriceTooLow from './PriceTooLow'
import {
  MapDispatchProps,
  MapDispatch,
  MapStateProps,
  OwnProps,
  Props
} from './PriceTooLow.types'

const mapState = (state: RootState): MapStateProps => ({
  isBuyNftsWithFiatEnabled: getIsBuyNftsWithFiatEnabled(state),
  isBuyWithCardPage: getIsBuyWithCardPage(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSwitchNetwork: chainId => dispatch(switchNetworkRequest(chainId))
})

const mergeProps = (
  stateProps: MapStateProps,
  dispatchProps: MapDispatchProps,
  ownProps: OwnProps
): Props => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
})

export default connect(mapState, mapDispatch, mergeProps)(PriceTooLow)
