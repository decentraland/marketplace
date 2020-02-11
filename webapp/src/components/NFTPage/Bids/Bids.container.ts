import { MapStateProps, MapDispatchProps, MapDispatch } from './Bids.types'
import { RootState } from '../../../modules/reducer'
import { getNFTBids } from '../../../modules/ui/selectors'
import { fetchBidsByNFTRequest } from '../../../modules/bid/actions'
import { connect } from 'react-redux'
import Bids from './Bids'

const mapState = (state: RootState): MapStateProps => ({
  bids: getNFTBids(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchBids: nft => dispatch(fetchBidsByNFTRequest(nft))
})

export default connect(mapState, mapDispatch)(Bids)
