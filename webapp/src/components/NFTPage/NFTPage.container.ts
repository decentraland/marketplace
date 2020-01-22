import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import { MapStateProps, MapDispatch, MapDispatchProps } from './NFTPage.types'
import {
  getContractAddress,
  getTokenId,
  getLoading,
  getCurrentNFT
} from '../../modules/nft/selectors'
import { getCurrentOrder } from '../../modules/order/selectors'
import { fetchNFTRequest, FETCH_NFT_REQUEST } from '../../modules/nft/actions'
import NFTPage from './NFTPage'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

const mapState = (state: RootState): MapStateProps => {
  return {
    contractAddress: getContractAddress(state),
    tokenId: getTokenId(state),
    nft: getCurrentNFT(state),
    order: getCurrentOrder(state),
    isLoading: isLoadingType(getLoading(state), FETCH_NFT_REQUEST)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchNFT: (contractAddress: string, tokenId: string) =>
    dispatch(fetchNFTRequest(contractAddress, tokenId))
})

export default connect(mapState, mapDispatch)(NFTPage)
