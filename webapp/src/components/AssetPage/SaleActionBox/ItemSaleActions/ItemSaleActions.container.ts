import { connect } from 'react-redux'
import { Asset } from '../../../../modules/asset/types'
import { fetchBidsByAssetRequest } from '../../../../modules/bid/actions'
import { RootState } from '../../../../modules/reducer'
import { getAssetBids } from '../../../../modules/ui/asset/bid/selectors'
import { getWallet } from '../../../../modules/wallet/selectors'
import ItemSaleActions from './ItemSaleActions'
import { MapStateProps, MapDispatch, MapDispatchProps } from './ItemSaleActions.types'

const mapState = (state: RootState): MapStateProps => {
  const wallet = getWallet(state)

  return {
    wallet,
    bids: getAssetBids(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchBids: (asset: Asset) => dispatch(fetchBidsByAssetRequest(asset))
})

export default connect(mapState, mapDispatch)(ItemSaleActions)
