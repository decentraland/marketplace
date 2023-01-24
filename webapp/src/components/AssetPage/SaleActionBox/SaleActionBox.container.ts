import { connect } from 'react-redux'
import { getData as getAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { RootState } from '../../../modules/reducer'
import { getMana, getWallet } from '../../../modules/wallet/selectors'
import { getNFTBids } from '../../../modules/ui/nft/bid/selectors'
import { getContract } from '../../../modules/contract/selectors'
import { getCurrentOrder } from '../../../modules/order/selectors'
import { Contract } from '../../../modules/vendor/services'
import {
  OwnProps,
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './SaleActionBox.types'
import SaleRentActionBox from './SaleActionBox'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const wallet = getWallet(state)
  return {
    wallet,
    order: getCurrentOrder(state),
    bids: getNFTBids(state),
    currentMana: getMana(state, ownProps.asset.network),
    authorizations: getAuthorizations(state),
    userHasAlreadyBidsOnNft: wallet
      ? getNFTBids(state).some(bid => bid.bidder === wallet.address)
      : false,
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

const mapDispatch = (
  _dispatch: MapDispatch,
  _ownProps: OwnProps
): MapDispatchProps => ({
  onBuyWithMana: () => {},
  onBuyWithCard: () => {},
  onBid: () => {}
})

export default connect(mapState, mapDispatch)(SaleRentActionBox)
