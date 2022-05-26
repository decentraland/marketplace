import { connect } from 'react-redux'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { MapDispatchProps, MapDispatch } from './PriceTooLow.types'
import PriceTooLow from './PriceTooLow'

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSwitchNetwork: chainId => dispatch(switchNetworkRequest(chainId))
})
export default connect(null, mapDispatch)(PriceTooLow)
