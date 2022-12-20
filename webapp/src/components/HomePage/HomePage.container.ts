import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { fetchAssetsFromRoute } from '../../modules/routing/actions'
import {
  getHomepage,
  getHomepageLoading
} from '../../modules/ui/asset/homepage/selectors'
import { MapStateProps, MapDispatchProps, MapDispatch } from './HomePage.types'
import HomePage from './HomePage'
import { getIsCampaignHomepageBannerEnabled } from '../../modules/features/selectors'

const mapState = (state: RootState): MapStateProps => ({
  homepage: getHomepage(state),
  homepageLoading: getHomepageLoading(state),
  isCampaignHomepageBannerEnabled: getIsCampaignHomepageBannerEnabled(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onFetchAssetsFromRoute: options => dispatch(fetchAssetsFromRoute(options))
})

export default connect(mapState, mapDispatch)(HomePage)
