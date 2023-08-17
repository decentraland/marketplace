import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RentalListing } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { NFT } from '../../../modules/nft/types'
import { RootState } from '../../../modules/reducer'
import { isClaimingBackLandTransactionPending, getLastTransactionForClaimingBackLand } from '../../../modules/ui/browse/selectors'
import { VendorName } from '../../../modules/vendor'
import { getWallet } from '../../../modules/wallet/selectors'
import { RentalModalMetadata } from '../../Modals/RentalListingModal/RentalListingModal.types'
import { Rent } from './Rent'
import { MapStateProps, MapDispatchProps, OwnProps } from './Rent.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => ({
  wallet: getWallet(state),
  isClaimingBackLandTransactionPending: isClaimingBackLandTransactionPending(state, ownProps.nft),
  claimingBackLandTransaction: getLastTransactionForClaimingBackLand(state, ownProps.nft)
})

const mapDispatch = (dispatch: Dispatch, ownProps: OwnProps): MapDispatchProps => ({
  onClaimLand: () =>
    dispatch(
      openModal('ClaimLandModal', {
        nft: ownProps.nft,
        rental: ownProps.rental
      })
    ),
  onCreateOrEditRent: (nft: NFT<VendorName>, rental: RentalListing | null) =>
    dispatch(
      openModal('RentalListingModal', {
        nft,
        rental
      } as RentalModalMetadata)
    )
})

export default connect(mapState, mapDispatch)(Rent)
