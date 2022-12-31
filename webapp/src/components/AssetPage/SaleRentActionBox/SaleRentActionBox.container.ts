import { connect } from 'react-redux'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { getData as getAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { RootState } from '../../../modules/reducer'
import { getMana, getWallet } from '../../../modules/wallet/selectors'
import { getNFTBids } from '../../../modules/ui/nft/bid/selectors'
import { getContract } from '../../../modules/contract/selectors'
import { Contract } from '../../../modules/vendor/services'
import {
  OwnProps,
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './SaleRentActionBox.types'
import SaleRentActionBox from './SaleRentActionBox'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const wallet = getWallet(state)
  return {
    wallet,
    currentMana: getMana(state, ownProps.nft.network),
    authorizations: getAuthorizations(state),
    userHasAlreadyBidsOnNft: wallet
      ? getNFTBids(state).some(bid => bid.bidder === wallet.address)
      : false,
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

const mapDispatch = (
  dispatch: MapDispatch,
  ownProps: OwnProps
): MapDispatchProps => ({
  onRent: (selectedPeriodIndex: number) =>
    dispatch(
      openModal('ConfirmRentModal', {
        nft: ownProps.nft,
        rental: ownProps.rental,
        selectedPeriodIndex
      })
    )
})

export default connect(mapState, mapDispatch)(SaleRentActionBox)
