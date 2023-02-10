import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { transferNFTRequest, TRANSFER_NFT_REQUEST } from '../../modules/nft/actions'
import { getLoading } from '../../modules/nft/selectors'
import { RootState } from '../../modules/reducer'
import TransferPage from './TransferPage'
import { MapStateProps, MapDispatchProps, MapDispatch } from './TransferPage.types'

const mapState = (state: RootState): MapStateProps => ({
  isTransferring: isLoadingType(getLoading(state), TRANSFER_NFT_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onTransfer: (nft, address) => dispatch(transferNFTRequest(nft, address))
})

export default connect(mapState, mapDispatch)(TransferPage)
