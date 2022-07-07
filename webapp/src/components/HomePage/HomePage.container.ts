import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { getState } from 'decentraland-dapps/dist/modules/features/selectors'
import { ApplicationName } from 'decentraland-dapps/dist/modules/features/types'
import { RootState } from '../../modules/reducer'
import { fetchAssetsFromRoute } from '../../modules/routing/actions'
import {
  getHomepage,
  getHomepageLoading
} from '../../modules/ui/asset/homepage/selectors'
import { getRankingsFeatureVariant } from '../../modules/features/selectors'
import { MapStateProps, MapDispatchProps, MapDispatch } from './HomePage.types'
import HomePage from './HomePage'

const mapState = (state: RootState): MapStateProps => ({
  homepage: getHomepage(state),
  homepageLoading: getHomepageLoading(state),
  features: getState(state).data[ApplicationName.MARKETPLACE],
  rankingsVariant: getRankingsFeatureVariant(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onFetchAssetsFromRoute: options => dispatch(fetchAssetsFromRoute(options))
})

export default connect(mapState, mapDispatch)(HomePage)
