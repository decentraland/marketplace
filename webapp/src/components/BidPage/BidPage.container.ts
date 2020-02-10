import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { getCurrentOrder } from '../../modules/order/selectors'
import { placeBidRequest } from '../../modules/bid/actions'
import { MapStateProps, MapDispatchProps, MapDispatch } from './BidPage.types'
import BidPage from './BidPage'

const mapState = (state: RootState): MapStateProps => ({
  order: getCurrentOrder(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onPlaceBid: (nft, price, expiresAt, fingerprint) =>
    dispatch(placeBidRequest(nft, price, expiresAt, fingerprint))
})

export default connect(mapState, mapDispatch)(BidPage)
