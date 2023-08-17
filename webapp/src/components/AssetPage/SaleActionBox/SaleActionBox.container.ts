import { connect } from 'react-redux'
import { getData as getAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { getContract } from '../../../modules/contract/selectors'
import { getCurrentOrder } from '../../../modules/order/selectors'
import { RootState } from '../../../modules/reducer'
import { getNFTBids } from '../../../modules/ui/nft/bid/selectors'
import { Contract } from '../../../modules/vendor/services'
import { getMana, getWallet } from '../../../modules/wallet/selectors'
import SaleRentActionBox from './SaleActionBox'
import { OwnProps, MapStateProps, MapDispatchProps, MapDispatch } from './SaleActionBox.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const wallet = getWallet(state)
  return {
    wallet,
    order: getCurrentOrder(state),
    bids: getNFTBids(state),
    currentMana: getMana(state, ownProps.asset.network),
    authorizations: getAuthorizations(state),
    userHasAlreadyBidsOnNft: wallet ? getNFTBids(state).some(bid => bid.bidder === wallet.address) : false,
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

const mapDispatch = (_dispatch: MapDispatch, _ownProps: OwnProps): MapDispatchProps => ({
  onBuyWithMana: () => {},
  onBuyWithCard: () => {},
  onBid: () => {}
})

export default connect(mapState, mapDispatch)(SaleRentActionBox)
