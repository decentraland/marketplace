import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../modules/reducer'
import { fetchNFTRequest, FETCH_NFT_REQUEST } from '../../modules/nft/actions'
import {
  getTokenId,
  getContractAddress,
  getLoading,
  getData as getNFTs
} from '../../modules/nft/selectors'
import { getData as getOrders } from '../../modules/order/selectors'
import { getNFTId } from '../../modules/nft/utils'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './NFTProvider.types'
import NFTProvider from './NFTProvider'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const contractAddress = ownProps.contractAddress || getContractAddress(state)
  const tokenId = ownProps.tokenId || getTokenId(state)
  const nfts = getNFTs(state)
  const orders = getOrders(state)
  let nft = null
  let order = null
  const nftId = getNFTId(contractAddress, tokenId)
  if (nftId && nftId in nfts) {
    nft = nfts[nftId]
  }

  if (nft && nft.activeOrderId && nft.activeOrderId in orders) {
    order = orders[nft.activeOrderId]
  }

  return {
    tokenId,
    contractAddress,
    nft,
    order,
    isLoading: isLoadingType(getLoading(state), FETCH_NFT_REQUEST)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchNFT: (contractAddress: string, tokenId: string) =>
    dispatch(fetchNFTRequest(contractAddress, tokenId))
})

const mergeProps = (
  stateProps: MapStateProps,
  dispatchProps: MapDispatchProps,
  ownProps: OwnProps
) => {
  console.log(stateProps, dispatchProps, ownProps)
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps
  }
}

export default connect(mapState, mapDispatch, mergeProps)(NFTProvider)
