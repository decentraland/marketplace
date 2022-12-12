import React, { useEffect, useState } from 'react'
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

  const [hasLoadedInitialFlags, setHasLoadedInitialFlags] = useState(false)
  useEffect(() => {
    if (!isLoadingFeatureFlags) {
      setHasLoadedInitialFlags(true)
    }
  }, [isLoadingFeatureFlags])

  useEffect(() => {
    if (contractAddress && tokenId && asset === null && !isLoading) {
      switch (type) {
        case AssetType.NFT:
          if (hasLoadedInitialFlags) {
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
    asset,
    contractAddress,
    tokenId,
    type,
    onFetchNFT,
    onFetchItem,
    rentalStatus,
    hasLoadedInitialFlags,
    isLoading
  ])

  return (
    <>
      {children(
        asset,
        order,
        rental,
        isLoading || (!hasLoadedInitialFlags && type === AssetType.NFT)
      )}
    </>
  )
}

export default React.memo(AssetProvider)
