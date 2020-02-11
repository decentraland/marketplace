import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { fetchNFTsRequest } from '../../modules/nft/actions'
import { MapStateProps, MapDispatchProps, MapDispatch } from './HomePage.types'
import HomePage from './HomePage'
import {
  getHomepageWearables,
  getHomepageLand,
  getHomepageENS,
  isHomepageWearablesLoading,
  isHomepageENSLoading,
  isHomepageLandLoading
} from '../../modules/ui/selectors'

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
  onFetchNFTs: options => dispatch(fetchNFTsRequest(options))
})

export default connect(mapState, mapDispatch)(HomePage)
