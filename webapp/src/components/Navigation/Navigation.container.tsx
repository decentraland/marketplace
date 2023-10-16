import { connect } from 'react-redux'
import { openBuyManaWithFiatModalRequest } from 'decentraland-dapps/dist/modules/gateway/actions'
import { getIsCampaignBrowserEnabled } from '../../modules/features/selectors'
import { getIsFullscreen } from '../../modules/routing/selectors'
import { RootState } from '../../modules/reducer'
import { browse } from '../../modules/routing/actions'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './Navigation.types'
import Navigation from './Navigation'

const mapState = (state: RootState): MapStateProps => ({
  isCampaignBrowserEnabled: getIsCampaignBrowserEnabled(state),
  isFullScreen: getIsFullscreen(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onOpenBuyManaWithFiatModal: () => dispatch(openBuyManaWithFiatModalRequest()),
  onBrowse: options => dispatch(browse(options))
})

export default connect(mapState, mapDispatch)(Navigation)
