import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { getLastModifiedDate, getTiles, getTilesByEstateId } from '../../modules/tile/selectors'
import { getOnRentNFTsByLessor } from '../../modules/ui/browse/selectors'
import { RootState } from '../../modules/reducer'
import { getWalletNFTs } from '../../modules/nft/selectors'
import { getContract } from '../../modules/contract/selectors'
import { Contract } from '../../modules/vendor/services'
import { getWallet } from '../../modules/wallet/selectors'
import { MapStateProps, MapDispatch, MapDispatchProps } from './Atlas.types'
import Atlas from './Atlas'

const mapState = (state: RootState): MapStateProps => {
  const wallet = getWallet(state)
  const nftsOnRent = wallet ? getOnRentNFTsByLessor(state, wallet?.address) : []

  return {
    tiles: getTiles(state),
    nfts: getWalletNFTs(state),
    nftsOnRent,
    tilesByEstateId: getTilesByEstateId(state),
    lastAtlasModifiedDate: getLastModifiedDate(state),
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(Atlas)
