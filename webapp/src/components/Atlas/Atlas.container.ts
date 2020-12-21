import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { getTiles, getTilesByEstateId } from '../../modules/tile/selectors'
import { RootState } from '../../modules/reducer'
import { getWalletNFTs } from '../../modules/nft/selectors'
import { MapStateProps, MapDispatch, MapDispatchProps } from './Atlas.types'
import Atlas from './Atlas'

const mapState = (state: RootState): MapStateProps => ({
  tiles: getTiles(state),
  nfts: getWalletNFTs(state),
  tilesByEstateId: getTilesByEstateId(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(Atlas)
