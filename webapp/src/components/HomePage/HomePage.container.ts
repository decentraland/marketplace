import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { fetchNFTsFromRoute } from '../../modules/routing/actions'
import {
  getHomepage,
  getHomepageLoading
} from '../../modules/ui/nft/homepage/selectors'
import { MapStateProps, MapDispatchProps, MapDispatch } from './HomePage.types'
import HomePage from './HomePage'

const mapState = (state: RootState): MapStateProps => ({
  homepage: getHomepage(state),
  homepageLoading: getHomepageLoading(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onFetchNFTsFromRoute: options => dispatch(fetchNFTsFromRoute(options))
})

export default connect(mapState, mapDispatch)(HomePage)
