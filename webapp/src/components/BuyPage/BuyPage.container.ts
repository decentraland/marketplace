import { connect } from 'react-redux'
import { ChainId } from '@dcl/schemas'
import { getAppChainId } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { RootState } from '../../modules/reducer'
import { MapStateProps, MapDispatch, MapDispatchProps } from './BuyPage.types'
import BuyPage from './BuyPage'

const mapState = (state: RootState): MapStateProps => {
  return {
    appChainId: getAppChainId(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSwitchNetwork: (chainId: ChainId) => dispatch(switchNetworkRequest(chainId))
})

export default connect(mapState, mapDispatch)(BuyPage)
