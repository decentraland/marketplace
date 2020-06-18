import React from 'react'
import { Page } from 'decentraland-ui'

import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { NFTProviderPage } from '../NFTProviderPage'
import { ParcelDetail } from './ParcelDetail'
import { EstateDetail } from './EstateDetail'
import { WearableDetail } from './WearableDetail'
import { ENSDetail } from './ENSDetail'
import { PictureFrameDetail } from './PictureFrameDetail'
import './NFTPage.css'

const NFTPage = () => {
  return (
    <>
      <Navbar isFullscreen />
      <Navigation isFullscreen />
      <Page className="NFTPage" isFullscreen>
        <NFTProviderPage>
          {nft => (
            <>
              {nft.parcel ? <ParcelDetail nft={nft} /> : null}
              {nft.estate ? <EstateDetail nft={nft} /> : null}
              {nft.wearable ? <WearableDetail nft={nft} /> : null}
              {nft.ens ? <ENSDetail nft={nft} /> : null}
              {nft.pictureFrame ? <PictureFrameDetail nft={nft} /> : null}
            </>
          )}
        </NFTProviderPage>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(NFTPage)
