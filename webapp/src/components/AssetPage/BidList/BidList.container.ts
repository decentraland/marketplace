import { connect } from 'react-redux'
import { fetchBidsByAssetRequest } from '../../../modules/bid/actions'
import { RootState } from '../../../modules/reducer'
import { getAssetBids } from '../../../modules/ui/asset/bid/selectors'
import BidList from './BidList'
import { MapStateProps, MapDispatchProps, MapDispatch } from './BidList.types'

const mapState = (state: RootState): MapStateProps => ({
  bids: getAssetBids(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchBids: nft => dispatch(fetchBidsByAssetRequest(nft))
})

export default connect(mapState, mapDispatch)(BidList)
