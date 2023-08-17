import { connect } from 'react-redux'
import { fetchBidsByNFTRequest } from '../../../modules/bid/actions'
import { RootState } from '../../../modules/reducer'
import { getNFTBids } from '../../../modules/ui/nft/bid/selectors'
import BidList from './BidList'
import { MapStateProps, MapDispatchProps, MapDispatch } from './BidList.types'

const mapState = (state: RootState): MapStateProps => ({
  bids: getNFTBids(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchBids: nft => dispatch(fetchBidsByNFTRequest(nft))
})

export default connect(mapState, mapDispatch)(BidList)
