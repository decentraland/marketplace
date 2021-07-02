import React from 'react'
import { Page } from 'decentraland-ui'

import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { NFTProviderPage } from '../NFTProviderPage'
import { NFTDetail } from '../Vendor/NFTDetail'
import './NFTPage.css'

const NFTPage = () => {
  return (
    <>
      <Navbar isFullscreen />
      <Navigation isFullscreen />
      <Page className="NFTPage" isFullscreen>
        <NFTProviderPage>{nft => <NFTDetail nft={nft} />}</NFTProviderPage>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(NFTPage)
