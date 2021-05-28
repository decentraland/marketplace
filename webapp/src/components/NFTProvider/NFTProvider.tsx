import React, { useEffect } from 'react'
import { Props } from './NFTProvider.types'
import './NFTProvider.css'

const NFTProvider = (props: Props) => {
  const {
    nft,
    order,
    isLoading,
    children,
    onFetchNFT,
    contractAddress,
    tokenId
  } = props

  useEffect(() => {
    if (contractAddress && tokenId) {
      onFetchNFT(contractAddress, tokenId)
    }
  }, [contractAddress, tokenId, onFetchNFT])

  return <>{children(nft, order, isLoading)}</>
}

export default React.memo(NFTProvider)
