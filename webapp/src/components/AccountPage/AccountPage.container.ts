import { connect } from 'react-redux'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from '../../modules/reducer'
import { getIsFullscreen, getVendor, getViewAsGuest } from '../../modules/routing/selectors'
import { getWallet } from '../../modules/wallet/selectors'
import AccountPage from './AccountPage'
import { MapStateProps, OwnProps } from './AccountPage.types'

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

export default connect(mapState)(AccountPage)
