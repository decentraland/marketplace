import React from 'react'
import { Page } from 'decentraland-ui'

import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { NFTProvider } from '../NFTProvider'
import { ParcelDetail } from './ParcelDetail'
import { EstateDetail } from './EstateDetail'
import { WearableDetail } from './WearableDetail'
import './NFTPage.css'

const NFTPage = () => {
  return (
    <>
      <Navbar isFullscreen />
      <Navigation isFullscreen />
      <Page className="NFTPage" isFullscreen>
        <NFTProvider>
          {nft => (
            <>
              {nft.parcel ? <ParcelDetail nft={nft} /> : null}
              {nft.estate ? <EstateDetail nft={nft} /> : null}
              {nft.wearable ? <WearableDetail nft={nft} /> : null}
            </>
          )}
        </NFTProvider>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(NFTPage)
