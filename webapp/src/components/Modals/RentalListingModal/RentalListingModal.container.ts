import { connect } from 'react-redux'
import { getData as getAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { RootState } from '../../../modules/reducer'
import { getAddress } from '../../../modules/wallet/selectors'
import { NFT } from '../../../modules/nft/types'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './RentalListingModal.types'
import RentalModal from './RentalListingModal'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state),
  authorizations: getAuthorizations(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onRemove: (nft: NFT) => dispatch(openModal('RemoveRentalModal', { nft }))
})

export default connect(mapState, mapDispatch)(RentalModal)
