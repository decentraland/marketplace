import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Network } from '@dcl/schemas'
import { isConnecting as getIsConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { isFetchingRequiredPermissions, isFetchingVideoHash } from '../../modules/asset/selectors'
import { Asset, AssetType } from '../../modules/asset/types'
import { getContract } from '../../modules/contract/selectors'
import { isLoadingFeatureFlags as getIsLoadingFeatureFlags } from '../../modules/features/selectors'
import { clearItemErrors, fetchItemRequest } from '../../modules/item/actions'
import { isFetchingItem, getError as getItemsError, getData as getItems } from '../../modules/item/selectors'
import { getItem } from '../../modules/item/utils'
import { fetchNFTRequest, clearNFTErrors } from '../../modules/nft/actions'
import { getError as getNFTError, getData as getNFTs, isLoading as isLoadingNFT } from '../../modules/nft/selectors'
import { getNFT } from '../../modules/nft/utils'
import { getData as getOrders } from '../../modules/order/selectors'
import { getActiveOrder } from '../../modules/order/utils'
import { RootState } from '../../modules/reducer'
import { getRentalById } from '../../modules/rental/selectors'
import { getOpenRentalId } from '../../modules/rental/utils'
import { useGetCurrentItemAddressAndTokenId, useGetCurrentNFTAddressAndTokenId } from '../../modules/routing/hooks'
import { FetchOneOptions } from '../../modules/vendor'
import { ContractName } from '../../modules/vendor/decentraland'
import { convertToOutputString } from '../../utils/output'
import AssetProvider from './AssetProvider'
import { OwnProps } from './AssetProvider.types'

const AssetProviderContainer = <T extends AssetType = AssetType>(props: OwnProps<T>) => {
  const dispatch = useDispatch()
  const { contractAddress: nftContractAddress, tokenId: nftTokenId } = useGetCurrentNFTAddressAndTokenId()
  const { contractAddress: itemContractAddress, tokenId: itemTokenId } = useGetCurrentItemAddressAndTokenId()

  const contractAddress = props.contractAddress || (props.type === AssetType.NFT ? nftContractAddress : itemContractAddress)
  const tokenId = props.tokenId || (props.type === AssetType.NFT ? nftTokenId : itemTokenId)

  // Get asset data based on type
  const nfts = useSelector(getNFTs)
  const items = useSelector(getItems)
  const nftError = useSelector(getNFTError)
  const itemsError = useSelector(getItemsError)
  const isItemLoading = useSelector((state: RootState) =>
    contractAddress && tokenId ? isFetchingItem(state, contractAddress, tokenId) : false
  )
  const isNftLoading = useSelector((state: RootState) => (contractAddress && tokenId ? isLoadingNFT(state) : false))

  let asset: Asset | null = null
  let isAssetLoading = false
  let error: string | null = null

  switch (props.type) {
    case AssetType.NFT:
      asset = getNFT(contractAddress, tokenId, nfts)
      isAssetLoading = isNftLoading
      error = nftError
      break
    case AssetType.ITEM:
      asset = getItem(contractAddress, tokenId, items)
      isAssetLoading = isItemLoading
      error = itemsError
      break
    default:
      throw new Error(`Invalid Asset type ${convertToOutputString(props.type)}`)
  }

  // Get additional loading states
  const isFetchingPermissions = useSelector((state: RootState) => (asset ? isFetchingRequiredPermissions(state, asset.id) : false))
  const isFetchingVideo = useSelector((state: RootState) => (asset ? isFetchingVideoHash(state, asset.id) : false))
  const isLoadingFeatureFlags = useSelector(getIsLoadingFeatureFlags)
  const isConnecting = useSelector(getIsConnecting)

  // Get orders and rental data
  const orders = useSelector(getOrders)
  const order = getActiveOrder(asset, orders)
  const openRentalId = getOpenRentalId(asset)
  const rental = useSelector((state: RootState) => (openRentalId ? getRentalById(state, openRentalId) : null))

  // Get contract information for land/estate check
  const landContract = useSelector((state: RootState) =>
    getContract(state, {
      name: ContractName.LAND,
      network: Network.ETHEREUM
    })
  )
  const estateContract = useSelector((state: RootState) =>
    getContract(state, {
      name: ContractName.ESTATES,
      network: Network.ETHEREUM
    })
  )

  const isLandOrEstate = !!contractAddress && (contractAddress === landContract?.address || contractAddress === estateContract?.address)

  const isLoading = isAssetLoading || isFetchingPermissions || isFetchingVideo

  const state = {
    tokenId,
    contractAddress,
    asset,
    rental,
    order,
    isLoading,
    isLoadingFeatureFlags,
    isLandOrEstate,
    error,
    isConnecting
  }

  const onFetchNFT = useCallback(
    (contractAddress: string, tokenId: string, options?: FetchOneOptions) => {
      dispatch(fetchNFTRequest(contractAddress, tokenId, options))
    },
    [dispatch]
  )

  const onFetchItem = useCallback(
    (contractAddress: string, tokenId: string) => {
      dispatch(fetchItemRequest(contractAddress, tokenId))
    },
    [dispatch]
  )

  const onClearErrors = useCallback(() => {
    if (props.type === AssetType.ITEM) {
      dispatch(clearItemErrors())
    } else {
      dispatch(clearNFTErrors())
    }
  }, [dispatch, props.type])

  return <AssetProvider {...(state as any)} {...props} onFetchNFT={onFetchNFT} onFetchItem={onFetchItem} onClearErrors={onClearErrors} />
}

export default AssetProviderContainer
