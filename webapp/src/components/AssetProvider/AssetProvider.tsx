import React, { useEffect, useState } from 'react'
import { AssetType } from '../../modules/asset/types'
import { convertToOutputString } from '../../utils/output'
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
    onClearErrors,
    contractAddress,
    tokenId,
    rentalStatus,
    isLoadingFeatureFlags,
    isLandOrEstate,
    retry,
    error,
    isConnecting
  } = props

  const [hasLoadedInitialFlags, setHasLoadedInitialFlags] = useState(false)
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false)

  useEffect(() => {
    if (error && !isLoading && retry && hasFetchedOnce) {
      onClearErrors()
      setTimeout(() => {
        setHasFetchedOnce(false)
      }, 3000)
    }
  }, [hasFetchedOnce, isLoading, error, retry, onClearErrors])

  useEffect(() => {
    if (!isLoadingFeatureFlags) {
      setHasLoadedInitialFlags(true)
    }
  }, [isLoadingFeatureFlags])

  useEffect(() => {
    setHasFetchedOnce(false)
  }, [contractAddress, tokenId])

  useEffect(() => {
    if (contractAddress && tokenId && asset === null && !isLoading && !hasFetchedOnce && !isConnecting) {
      switch (type) {
        case AssetType.NFT:
          if (hasLoadedInitialFlags) {
            onFetchNFT(contractAddress, tokenId, {
              rentalStatus: isLandOrEstate ? rentalStatus : undefined
            })
            setHasFetchedOnce(true)
          }
          break
        case AssetType.ITEM:
          onFetchItem(contractAddress, tokenId)
          setHasFetchedOnce(true)
          break
        default:
          throw new Error(`Invalid Asset type ${convertToOutputString(type)}`)
      }
    }
  }, [
    asset,
    contractAddress,
    hasFetchedOnce,
    tokenId,
    type,
    onFetchNFT,
    onFetchItem,
    rentalStatus,
    hasLoadedInitialFlags,
    isLoading,
    isLandOrEstate,
    isConnecting
  ])

  return <>{children(asset, order, rental, isLoading || (!hasLoadedInitialFlags && type === AssetType.NFT))}</>
}

export default React.memo(AssetProvider)
