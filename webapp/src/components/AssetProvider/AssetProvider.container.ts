import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../modules/reducer'
import { fetchNFTRequest, FETCH_NFT_REQUEST } from '../../modules/nft/actions'
import {
  fetchItemRequest,
  FETCH_ITEM_REQUEST
} from '../../modules/item/actions'
import { getLoading as getItemLoading } from '../../modules/nft/selectors'
import {
  getTokenId,
  getContractAddress,
  getLoading as getNFTLoading,
  getData as getNFTs
} from '../../modules/nft/selectors'
import { getData as getOrders } from '../../modules/order/selectors'
import { getNFT } from '../../modules/nft/utils'
import { getActiveOrder } from '../../modules/order/utils'
import { Asset, ResultType } from '../../modules/routing/types'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './AssetProvider.types'
import AssetProvider from './AssetProvider'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const contractAddress = ownProps.contractAddress || getContractAddress(state)
  const tokenId = ownProps.tokenId || getTokenId(state)
  const orders = getOrders(state)

  let asset: Asset | null = null
  let isLoading = false
  switch (ownProps.type) {
    case ResultType.NFT: {
      const nfts = getNFTs(state)
      asset = getNFT(contractAddress, tokenId, nfts)
      isLoading = isLoadingType(getNFTLoading(state), FETCH_NFT_REQUEST)
      break
    }
    case ResultType.ITEM: {
      // TODO: getItem selector
      asset = null
      isLoading = isLoadingType(getItemLoading(state), FETCH_ITEM_REQUEST)
      break
    }
    default:
      throw new Error(`Invalid Asset type ${ownProps.type}`)
  }
  const order = getActiveOrder(asset, orders)

  return {
    tokenId,
    contractAddress,
    asset,
    order,
    isLoading: !asset && isLoading
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchNFT: (contractAddress: string, tokenId: string) =>
    dispatch(fetchNFTRequest(contractAddress, tokenId)),
  onFetchItem: (contractAddress: string, tokenId: string) =>
    dispatch(fetchItemRequest(contractAddress, tokenId))
})

const mergeProps = (
  stateProps: MapStateProps,
  dispatchProps: MapDispatchProps,
  ownProps: OwnProps
) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
})

export default connect(mapState, mapDispatch, mergeProps)(AssetProvider) as <
  T extends ResultType = ResultType
>(
  props: OwnProps<T>
) => JSX.Element
