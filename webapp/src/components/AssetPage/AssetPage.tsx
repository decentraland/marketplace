import React from 'react'
import { Page, Section, Column, Back, Narrow } from 'decentraland-ui'
import { Asset, AssetType } from '../../modules/asset/types'
import { AssetProviderPage } from '../AssetProviderPage'
import { ItemDetail } from './ItemDetail'
import { Props } from './AssetPage.types'
import { ParcelDetail } from './ParcelDetail'
import { EstateDetail } from './EstateDetail'
import { WearableDetail } from './WearableDetail'
import { ENSDetail } from './ENSDetail'
import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { Footer } from '../Footer'

const AssetPage = ({ type, onBack }: Props) => (
  <>
    <Navbar isFullscreen />
    <Navigation />
    <Page className="BaseDetail">
      <Section>
        <Column>
          <Back className="back" absolute onClick={onBack} />
          <Narrow>
            <AssetProviderPage type={type}>
              {asset => {
                switch (type) {
                  case AssetType.ITEM:
                    const item = asset as Asset<AssetType.ITEM>

                    return <ItemDetail item={item} />

                  case AssetType.NFT:
                    const nft = asset as Asset<AssetType.NFT>
                    const { parcel, estate, wearable, ens } = nft.data as any

                    if (parcel) {
                      return <ParcelDetail nft={nft} />
                    }

                    if (estate) {
                      return <EstateDetail nft={nft} />
                    }

                    if (wearable) {
                      return <WearableDetail nft={nft} />
                    }

                    if (ens) {
                      return <ENSDetail nft={nft} />
                    }
                }

                return null
              }}
            </AssetProviderPage>
          </Narrow>
        </Column>
      </Section>
    </Page>
    <Footer />
  </>
)

export default React.memo(AssetPage)
