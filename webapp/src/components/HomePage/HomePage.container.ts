import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { fetchNFTsFromRoute } from '../../modules/routing/actions'
import {
  getHomepageWearables,
  getHomepageLand,
  getHomepageENS,
  isHomepageWearablesLoading,
  isHomepageENSLoading,
  isHomepageLandLoading
} from '../../modules/ui/selectors'
import { MapStateProps, MapDispatchProps, MapDispatch } from './HomePage.types'
import HomePage from './HomePage'

const mapState = (state: RootState): MapStateProps => ({
  wearables: getHomepageWearables(state),
  land: getHomepageLand(state),
  ens: getHomepageENS(state),
  isWearablesLoading: isHomepageWearablesLoading(state),
  isENSLoading: isHomepageENSLoading(state),
  isLandLoading: isHomepageLandLoading(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onFetchNFTsFromRoute: options => dispatch(fetchNFTsFromRoute(options))
})

export default connect(mapState, mapDispatch)(HomePage)
