import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Network } from '@dcl/schemas'
import { hasLoadedInitialFlags } from 'decentraland-dapps/dist/modules/features/selectors'
import { isConnecting as getIsConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { isFetchingRequiredPermissions, isFetchingVideoHash } from '../../modules/asset/selectors'
import { Asset, AssetType } from '../../modules/asset/types'
import { getContract } from '../../modules/contract/selectors'
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
import { useGetItemAddressAndTokenIdFromCurrentUrl, useGetNFTAddressAndTokenIdFromCurrentUrl } from '../../modules/routing/hooks'
import { FetchOneOptions } from '../../modules/vendor'
import { ContractName } from '../../modules/vendor/decentraland'
import AssetProvider from './AssetProvider'
import { ContainerProps } from './AssetProvider.types'

const AssetProviderContainer = <T extends AssetType = AssetType>(props: ContainerProps<T>) => {
  const dispatch = useDispatch()
  const { contractAddress: nftContractAddress, tokenId: nftTokenId } = useGetNFTAddressAndTokenIdFromCurrentUrl()
  const { contractAddress: itemContractAddress, tokenId: itemTokenId } = useGetItemAddressAndTokenIdFromCurrentUrl()

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

  const asset: Asset<T> | null = useMemo(
    () =>
      (props.type === AssetType.NFT ? getNFT(contractAddress, tokenId, nfts) : getItem(contractAddress, tokenId, items)) as Asset<T> | null,
    [props.type, contractAddress, tokenId, nfts, items]
  )
  const isAssetLoading = useMemo(
    () => (props.type === AssetType.NFT ? isNftLoading : isItemLoading),
    [props.type, isNftLoading, isItemLoading]
  )
  const error: string | null = useMemo(() => (props.type === AssetType.NFT ? nftError : itemsError), [props.type, nftError, itemsError])

  // Get additional loading states
  const isFetchingPermissions = useSelector((state: RootState) => (asset ? isFetchingRequiredPermissions(state, asset.id) : false))
  const isFetchingVideo = useSelector((state: RootState) => (asset ? isFetchingVideoHash(state, asset.id) : false))
  const initialFlagsLoaded = useSelector(hasLoadedInitialFlags)
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

  return (
    <AssetProvider
      type={props.type}
      children={props.children}
      rentalStatus={props.rentalStatus}
      retry={props.retry}
      withEntity={props.withEntity}
      tokenId={tokenId}
      contractAddress={contractAddress}
      asset={asset}
      rental={rental}
      order={order}
      isLoading={isLoading}
      hasLoadedInitialFlags={initialFlagsLoaded}
      isLandOrEstate={isLandOrEstate}
      error={error}
      isConnecting={isConnecting}
      onFetchNFT={onFetchNFT}
      onFetchItem={onFetchItem}
      onClearErrors={onClearErrors}
    />
  )
}

export default AssetProviderContainer
