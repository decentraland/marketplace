import React from 'react'
import { Page } from 'decentraland-ui'
import { Navbar, Footer } from 'decentraland-dapps/dist/containers'

import { NFT } from '../../modules/nft/types'

import { NFTProvider } from '../NFTProvider'
import { ParcelDetail } from './ParcelDetail'
import { EstateDetail } from './EstateDetail'
import { WearableDetail } from './WearableDetail'
import './NFTPage.css'

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

const NFTPage = () => {
  return (
    <>
      <Navbar isFullscreen activePage="marketplace" />
      <Page className="NFTPage" isFullscreen>
        <NFTProvider>{nft => <NFTDetail nft={nft} />}</NFTProvider>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(NFTPage)
