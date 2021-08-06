import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../modules/reducer'
import { fetchNFTRequest, FETCH_NFT_REQUEST } from '../../modules/nft/actions'
import {
  fetchItemRequest,
  FETCH_ITEM_REQUEST
} from '../../modules/item/actions'
import {
  getContractAddress as getNFTContractAddress,
  getTokenId as getNFTTokenId,
  getLoading as getNFTLoading,
  getData as getNFTs
} from '../../modules/nft/selectors'
import {
  getContractAddress as getItemContractAddress,
  getTokenId as getItemTokenId,
  getLoading as getItemLoading,
  getData as getItems
} from '../../modules/item/selectors'
import { getData as getOrders } from '../../modules/order/selectors'
import { getNFT } from '../../modules/nft/utils'
import { getItem } from '../../modules/item/utils'
import { getActiveOrder } from '../../modules/order/utils'
import { Asset, AssetType } from '../../modules/asset/types'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './AssetProvider.types'
import AssetProvider from './AssetProvider'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  let contractAddress = ownProps.contractAddress
  let tokenId = ownProps.tokenId
  const orders = getOrders(state)

  let asset: Asset | null = null
  let isLoading = false
  switch (ownProps.type) {
    case AssetType.NFT: {
      const nfts = getNFTs(state)
      contractAddress = contractAddress || getNFTContractAddress(state)
      tokenId = tokenId || getNFTTokenId(state)
      asset = getNFT(contractAddress, tokenId, nfts)
      isLoading = isLoadingType(getNFTLoading(state), FETCH_NFT_REQUEST)
      break
    }
    case AssetType.ITEM: {
      const items = getItems(state)
      contractAddress = contractAddress || getItemContractAddress(state)
      tokenId = tokenId || getItemTokenId(state)
      asset = getItem(contractAddress, tokenId, items)
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
  T extends AssetType = AssetType
>(
  props: OwnProps<T>
) => JSX.Element
