import React, { useEffect, useRef, useState } from 'react'
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
    isLoadingFeatureFlags,
    isLandOrEstate
  } = props

  const [hasLoadedInitialFlags, setHasLoadedInitialFlags] = useState(false)

  const hasFetchedOnce = useRef(false)

  useEffect(() => {
    if (!isLoadingFeatureFlags) {
      setHasLoadedInitialFlags(true)
    }
  }, [isLoadingFeatureFlags])

  useEffect(() => {
    hasFetchedOnce.current = false
  }, [contractAddress, tokenId])

  useEffect(() => {
    if (
      contractAddress &&
      tokenId &&
      asset === null &&
      !isLoading &&
      !hasFetchedOnce.current
    ) {
      switch (type) {
        case AssetType.NFT:
          if (hasLoadedInitialFlags) {
            onFetchNFT(contractAddress, tokenId, {
              rentalStatus: isLandOrEstate ? rentalStatus : undefined
            })
            hasFetchedOnce.current = true
          }
          break
        case AssetType.ITEM:
          onFetchItem(contractAddress, tokenId)
          hasFetchedOnce.current = true
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
    isLoading,
    isLandOrEstate
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
