import React, { useEffect } from 'react'
import { ResultType } from '../../modules/asset/types'
import { Props } from './AssetProvider.types'

const AssetProvider = (props: Props) => {
  const {
    type,
    asset,
    order,
    isLoading,
    children,
    onFetchNFT,
    onFetchItem,
    contractAddress,
    tokenId
  } = props

  useEffect(() => {
    if (contractAddress && tokenId) {
      switch (type) {
        case ResultType.NFT:
          onFetchNFT(contractAddress, tokenId)
          break
        case ResultType.ITEM:
          onFetchItem(contractAddress, tokenId)
          break
        default:
          throw new Error(`Invalid Asset type ${type}`)
      }
    }
  }, [contractAddress, tokenId, type, onFetchNFT, onFetchItem])

  return <>{children(asset, order, isLoading)}</>
}

export default React.memo(AssetProvider)
