import { connect } from 'react-redux'
import { replace } from 'connected-react-router'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'

import { RootState } from '../../modules/reducer'
import {
  getIsFullscreen,
  getVendor,
  getViewAsGuest
} from '../../modules/routing/selectors'
import { getWallet } from '../../modules/wallet/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps,
  OwnProps
} from './AccountPage.types'
import AccountPage from './AccountPage'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { address } = ownProps.match.params

  return {
    addressInUrl: address?.toLowerCase(),
    vendor: getVendor(state),
    wallet: getWallet(state),
    isConnecting: isConnecting(state),
    isFullscreen: getIsFullscreen(state),
    viewAsGuest: !!getViewAsGuest(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onRedirect: path => dispatch(replace(path))
})

export default connect(mapState, mapDispatch)(AccountPage)
