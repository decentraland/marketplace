import React, { useEffect } from 'react'
import { Page, Loader } from 'decentraland-ui'
import { Navbar, Footer } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { Props } from './NFTPage.types'
import { NFT } from '../../modules/nft/types'

import './NFTPage.css'
import { ParcelDetail } from './ParcelDetail'
import { EstateDetail } from './EstateDetail'
import { WearableDetail } from './WearableDetail'

const Loading = () => (
  <div className="center">
    <Loader active size="huge" />
  </div>
)

const NotFound = () => (
  <div className="center">
    <p className="secondary-text">{t('detail.not_found')}</p>
  </div>
)

const NFTDetail = (props: { nft: NFT }) => {
  const { nft } = props
  if (nft.parcel) {
    return <ParcelDetail nft={nft} />
  }
  if (nft.estate) {
    return <EstateDetail nft={nft} />
  }
  if (nft.wearable) {
    return <WearableDetail nft={nft} />
  }
  return null
}

const NFTPage = (props: Props) => {
  const { nft, contractAddress, tokenId, onFetchNFT, isLoading } = props
  useEffect(() => {
    if (!nft && contractAddress && tokenId) {
      onFetchNFT(contractAddress, tokenId)
    }
  }, [nft, contractAddress, tokenId, onFetchNFT])

  return (
    <>
      <Navbar isFullscreen activePage="marketplace" />
      <Page className="NFTPage" isFullscreen>
        {isLoading ? <Loading /> : null}
        {!isLoading && !nft ? <NotFound /> : null}
        {nft ? <NFTDetail nft={nft} /> : null}
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(NFTPage)
