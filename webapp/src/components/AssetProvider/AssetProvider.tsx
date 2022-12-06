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
    if (contractAddress && tokenId) {
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
    contractAddress,
    tokenId,
    type,
    onFetchNFT,
    onFetchItem,
    rentalStatus,
    isLoadingFeatureFlags,
    hasLoadedInitialFlags
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
