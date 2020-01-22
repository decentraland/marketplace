import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../modules/reducer'
import { fetchNFTRequest, FETCH_NFT_REQUEST } from '../../modules/nft/actions'
import {
  getTokenId,
  getContractAddress,
  getCurrentNFT,
  getLoading
} from '../../modules/nft/selectors'
import { getCurrentOrder } from '../../modules/order/selectors'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './NFTProvider.types'
import NFTProvider from './NFTProvider'

const mapState = (state: RootState): MapStateProps => {
  return {
    tokenId: getTokenId(state),
    contractAddress: getContractAddress(state),
    nft: getCurrentNFT(state),
    order: getCurrentOrder(state),
    isLoading: isLoadingType(getLoading(state), FETCH_NFT_REQUEST)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchNFT: (contractAddress: string, tokenId: string) =>
    dispatch(fetchNFTRequest(contractAddress, tokenId))
})

export default connect(mapState, mapDispatch)(NFTProvider)
