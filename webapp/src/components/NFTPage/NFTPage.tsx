import React from 'react'
import { Page } from 'decentraland-ui'
import { Navbar, Footer } from 'decentraland-dapps/dist/containers'

import { NFTProvider } from '../NFTProvider'
import { ParcelDetail } from './ParcelDetail'
import { EstateDetail } from './EstateDetail'
import { WearableDetail } from './WearableDetail'
import './NFTPage.css'

const NFTPage = () => {
  return (
    <>
      <Navbar isFullscreen activePage="marketplace" />
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
