import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RentalListing } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { RootState } from '../../../modules/reducer'
import { MapStateProps, MapDispatchProps, OwnProps } from './Rent.types'
import { RentalModalMetadata } from '../../Modals/RentalListingModal/RentalListingModal.types'
import { VendorName } from '../../../modules/vendor'
import { NFT } from '../../../modules/nft/types'
import { Rent } from './Rent'
import { isClaimingBackLandTransactionPending, getLastTransactionForClaimingBackLand} from '../../../modules/ui/browse/selectors'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => ({
  isClaimingBackLandTransactionPending: isClaimingBackLandTransactionPending(state, ownProps.nft),
  claimingBackLandTransaction: getLastTransactionForClaimingBackLand(state, ownProps.nft)
})

const mapDispatch = (
  dispatch: Dispatch,
  ownProps: OwnProps
): MapDispatchProps => ({
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
