import { connect } from 'react-redux'
import { getIsCampaignBrowserEnabled } from '../../modules/features/selectors'
import { getIsFullscreen } from '../../modules/routing/selectors'
import { RootState } from '../../modules/reducer'
import { MapStateProps } from './Navigation.types'
import Navigation from './Navigation'

const mapState = (state: RootState): MapStateProps => ({
  isCampaignBrowserEnabled: getIsCampaignBrowserEnabled(state),
  isFullScreen: getIsFullscreen(state)
})

export default connect(mapState)(Navigation)
