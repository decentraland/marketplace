import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../modules/reducer'
import { getLoading } from '../../modules/nft/selectors'
import {
  transferNFTRequest,
  TRANSFER_NFT_REQUEST
} from '../../modules/nft/actions'
import { getIsEnsAddressEnabled } from '../../modules/features/selectors'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './TransferPage.types'
import TransferPage from './TransferPage'

const mapState = (state: RootState): MapStateProps => ({
  isTransferring: isLoadingType(getLoading(state), TRANSFER_NFT_REQUEST),
  isEnsAddressEnabled: getIsEnsAddressEnabled(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onTransfer: (nft, address) => dispatch(transferNFTRequest(nft, address))
})

export default connect(mapState, mapDispatch)(TransferPage)
