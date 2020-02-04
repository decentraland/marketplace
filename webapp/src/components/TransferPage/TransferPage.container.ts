import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { transferNFTRequest } from '../../modules/nft/actions'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './TransferPage.types'
import TransferPage from './TransferPage'

const mapState = (_state: RootState): MapStateProps => ({})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onTransfer: (nft, address) => dispatch(transferNFTRequest(nft, address))
})

export default connect(mapState, mapDispatch)(TransferPage)
