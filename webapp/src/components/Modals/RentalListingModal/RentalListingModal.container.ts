import { connect } from 'react-redux'
import { getData as getAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { NFT } from '../../../modules/nft/types'
import { RootState } from '../../../modules/reducer'
import { getAddress, getWallet } from '../../../modules/wallet/selectors'
import RentalModal from './RentalListingModal'
import { MapStateProps, MapDispatchProps, MapDispatch } from './RentalListingModal.types'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state),
  authorizations: getAuthorizations(state),
  wallet: getWallet(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onRemove: (nft: NFT) => dispatch(openModal('RemoveRentalModal', { nft }))
})

export default connect(mapState, mapDispatch)(RentalModal)
