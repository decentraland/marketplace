import React, { useEffect } from 'react'
import { AssetType } from '../../modules/asset/types'
import { Props } from './AssetProvider.types'

const AssetProvider = (props: Props) => {
  const {
    type,
    asset,
    order,
    rental,
    isLoading,
    children,
    onFetchNFT,
    onFetchItem,
    contractAddress,
    tokenId,
    rentalStatus,
    isLoadingFeatureFlags
  } = props

  useEffect(() => {
    if (contractAddress && tokenId) {
      switch (type) {
        case AssetType.NFT:
          if (!isLoadingFeatureFlags) {
            onFetchNFT(contractAddress, tokenId, { rentalStatus })
          }
          break
        case AssetType.ITEM:
          onFetchItem(contractAddress, tokenId)
          break
        default:
          throw new Error(`Invalid Asset type ${type}`)
      }
    }
  }, [
    contractAddress,
    tokenId,
    type,
    onFetchNFT,
    onFetchItem,
    rentalStatus,
    isLoadingFeatureFlags
  ])

  return (
    <>
      {children(
        asset,
        order,
        rental,
        isLoading || (isLoadingFeatureFlags && type === AssetType.NFT)
      )}
    </>
  )
}

export default React.memo(AssetProvider)
