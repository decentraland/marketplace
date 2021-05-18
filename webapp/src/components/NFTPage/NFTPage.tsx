import React from 'react'
import { Page } from 'decentraland-ui'

import { VendorName } from '../../modules/vendor/types'
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
          {nft => {
            // TODO: Move this to components/vendor
            const { parcel, estate, wearable, ens } = nft.data as any
            return (
              <>
                {parcel ? <ParcelDetail nft={nft} /> : null}
                {estate ? <EstateDetail nft={nft} /> : null}
                {wearable ? <WearableDetail nft={nft} /> : null}
                {ens ? <ENSDetail nft={nft} /> : null}
                {nft.vendor !== VendorName.DECENTRALAND ? (
                  <PictureFrameDetail nft={nft} />
                ) : null}
              </>
            )
          }}
        </NFTProviderPage>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(NFTPage)
