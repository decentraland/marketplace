import { connect } from 'react-redux'
import { Network } from '@dcl/schemas'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { FETCH_APPLICATION_FEATURES_REQUEST } from 'decentraland-dapps/dist/modules/features/actions'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { isLoadingFeatureFlags as getIsLoadingFeatureFlags } from '../../modules/features/selectors'
import { RootState } from '../../modules/reducer'
import { fetchNFTRequest, FETCH_NFT_REQUEST, clearNFTErrors } from '../../modules/nft/actions'
import { clearItemErrors, fetchItemRequest } from '../../modules/item/actions'
import {
  getContractAddress as getNFTContractAddress,
  getTokenId as getNFTTokenId,
  getLoading as getNFTLoading,
  getError as getNFTError,
  getData as getNFTs
} from '../../modules/nft/selectors'
import {
  getContractAddress as getItemContractAddress,
  getTokenId as getItemTokenId,
  isFetchingItem,
  getError as getItemsError,
  getData as getItems
} from '../../modules/item/selectors'
import { isFetchingRequiredPermissions, isFetchingVideoHash } from '../../modules/asset/selectors'
import { getData as getOrders } from '../../modules/order/selectors'
import { getNFT } from '../../modules/nft/utils'
import { getItem } from '../../modules/item/utils'
import { getActiveOrder } from '../../modules/order/utils'
import { Asset, AssetType } from '../../modules/asset/types'
import { getRentalById } from '../../modules/rental/selectors'
import { getOpenRentalId } from '../../modules/rental/utils'
import { FetchOneOptions } from '../../modules/vendor'
import { getContract } from '../../modules/contract/selectors'
import { ContractName } from '../../modules/vendor/decentraland'
import { convertToOutputString } from '../../utils/output'
import { MapDispatch, MapDispatchProps, MapStateProps, OwnProps } from './AssetProvider.types'
import AssetProvider from './AssetProvider'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  let contractAddress = ownProps.contractAddress
  let tokenId = ownProps.tokenId
  const orders = getOrders(state)
  let error: string | null = null

  let asset: Asset | null = null
  let isLoading = false
  switch (ownProps.type) {
    case AssetType.NFT: {
      const nfts = getNFTs(state)
      contractAddress = contractAddress || getNFTContractAddress(state)
      tokenId = tokenId || getNFTTokenId(state)
      asset = getNFT(contractAddress, tokenId, nfts)
      isLoading = isLoadingType(getNFTLoading(state), FETCH_NFT_REQUEST)
      error = getNFTError(state)
      break
    }
    case AssetType.ITEM: {
      const items = getItems(state)
      contractAddress = contractAddress || getItemContractAddress(state)
      tokenId = tokenId || getItemTokenId(state)
      asset = getItem(contractAddress, tokenId, items)
      isLoading = isFetchingItem(state, contractAddress!, tokenId!)
      error = getItemsError(state)
      break
    }
    default:
      throw new Error(`Invalid Asset type ${convertToOutputString(ownProps.type)}`)
  }
  const order = getActiveOrder(asset, orders)
  const openRentalId = getOpenRentalId(asset)
  const rental = openRentalId ? getRentalById(state, openRentalId) : null

  const landContract = getContract(state, {
    name: ContractName.LAND,
    network: Network.ETHEREUM
  })

  const estateContract = getContract(state, {
    name: ContractName.ESTATES,
    network: Network.ETHEREUM
  })

  const isLandOrEstate = !!contractAddress && (contractAddress === landContract?.address || contractAddress === estateContract?.address)

  return {
    tokenId,
    contractAddress,
    asset,
    rental,
    order,
    isLoading: !asset ? isLoading : isFetchingRequiredPermissions(state, asset.id) || isFetchingVideoHash(state, asset.id),
    isLoadingFeatureFlags: isLoadingType(getIsLoadingFeatureFlags(state), FETCH_APPLICATION_FEATURES_REQUEST),
    isLandOrEstate,
    error,
    isConnecting: isConnecting(state)
  }
}

const mapDispatch = (dispatch: MapDispatch, ownProps: OwnProps): MapDispatchProps => ({
  onFetchNFT: (contractAddress: string, tokenId: string, options?: FetchOneOptions) =>
    dispatch(fetchNFTRequest(contractAddress, tokenId, options)),
  onFetchItem: (contractAddress: string, tokenId: string) => dispatch(fetchItemRequest(contractAddress, tokenId)),
  onClearErrors: () => {
    if (ownProps.type === AssetType.ITEM) {
      return dispatch(clearItemErrors())
    }

    return dispatch(clearNFTErrors())
  }
})

const mergeProps = (stateProps: MapStateProps, dispatchProps: MapDispatchProps, ownProps: OwnProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
})

export default connect(mapState, mapDispatch, mergeProps)(AssetProvider) as <T extends AssetType = AssetType>(
  props: OwnProps<T>
) => JSX.Element
