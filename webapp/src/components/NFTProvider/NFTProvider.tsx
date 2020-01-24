import React, { useEffect } from 'react'
import { Loader } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './NFTProvider.types'
import './NFTProvider.css'

const Loading = () => (
  <div className="nft-center">
    <Loader active size="huge" />
  </div>
)

const NotFound = () => (
  <div className="nft-center">
    <p className="secondary-text">{t('global.not_found')}&hellip;</p>
  </div>
)

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
    if (!nft && contractAddress && tokenId) {
      onFetchNFT(contractAddress, tokenId)
    }
  }, [nft, contractAddress, tokenId, onFetchNFT])

  return (
    <>
      {isLoading ? <Loading /> : null}
      {!isLoading && !nft ? <NotFound /> : null}
      {nft ? children(nft, order) : null}
    </>
  )
}

export default React.memo(NFTProvider)
