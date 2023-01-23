import { connect } from 'react-redux'
import { RootState } from '../../../../modules/reducer'
import { getWallet } from '../../../../modules/wallet/selectors'
import { getNFTBids } from '../../../../modules/ui/nft/bid/selectors'
import { getCurrentOrder } from '../../../../modules/order/selectors'
import { MapStateProps } from './NFTSaleActions.types'
import SaleRentActionBox from './NFTSaleActions'

const mapState = (state: RootState): MapStateProps => ({
  wallet: getWallet(state),
  order: getCurrentOrder(state),
  bids: getNFTBids(state)
})

export default connect(mapState)(SaleRentActionBox)
