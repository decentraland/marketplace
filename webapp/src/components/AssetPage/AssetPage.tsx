import React from 'react'
import { Page, Section, Column, Back, Narrow } from 'decentraland-ui'
import { Asset, AssetType } from '../../modules/asset/types'
import { AssetProviderPage } from '../AssetProviderPage'
import { ItemDetail } from './ItemDetail'
import { ErrorBoundary } from './ErrorBoundary'
import { Props } from './AssetPage.types'
import { ParcelDetail } from './ParcelDetail'
import { EstateDetail } from './EstateDetail'
import { WearableDetail } from './WearableDetail'
import { ENSDetail } from './ENSDetail'
import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { Footer } from '../Footer'
import { AssetProvider } from '../AssetProvider'
import { locations } from '../../modules/routing/locations'
import { Sections } from '../../modules/routing/types'
import './AssetPage.css'

const AssetPage = ({ type, onBack }: Props) => {
  return (
    <>
      <Navbar isFullscreen />
      <Navigation />
      <Page className="AssetPage">
        <ErrorBoundary>
          <Section>
            <Column>
              <AssetProvider type={type}>
                {asset => (
                  <Back
                    className="back"
                    absolute
                    onClick={() =>
                      onBack(
                        mapAsset(
                          asset,
                          {
                            item: () =>
                              locations.browse({
                                assetType: type,
                                section: Sections.decentraland.WEARABLES
                              }),
                            ens: () =>
                              locations.browse({
                                assetType: type,
                                section: Sections.decentraland.ENS
                              }),
                            estate: () =>
                              locations.lands({
                                assetType: type,
                                section: Sections.decentraland.ESTATES,
                                isMap: false,
                                isFullscreen: false
                              }),
                            parcel: () =>
                              locations.lands({
                                assetType: type,
                                section: Sections.decentraland.PARCELS,
                                isMap: false,
                                isFullscreen: false
                              }),
                            wearable: () =>
                              locations.browse({
                                assetType: type,
                                section: Sections.decentraland.WEARABLES
                              })
                          },
                          () => undefined
                        )
                      )
                    }
                  />
                )}
              </AssetProvider>
              <Narrow>
                <AssetProviderPage type={type}>
                  {asset =>
                    mapAsset(
                      asset,
                      {
                        item: item => <ItemDetail item={item} />,
                        ens: nft => <ENSDetail nft={nft} />,
                        estate: nft => <EstateDetail nft={nft} />,
                        parcel: nft => <ParcelDetail nft={nft} />,
                        wearable: nft => <WearableDetail nft={nft} />
                      },
                      () => null
                    )
                  }
                </AssetProviderPage>
              </Narrow>
            </Column>
          </Section>
        </ErrorBoundary>
      </Page>
      <Footer />
    </>
  )

  function mapAsset<T>(
    asset: Asset | null,
    mappers: {
      item: (asset: Asset<AssetType.ITEM>) => T
      wearable: (asset: Asset<AssetType.NFT>) => T
      parcel: (asset: Asset<AssetType.NFT>) => T
      estate: (asset: Asset<AssetType.NFT>) => T
      ens: (asset: Asset<AssetType.NFT>) => T
    },
    fallback: () => T
  ) {
    if (!asset) {
      return fallback()
    }

    switch (type) {
      case AssetType.ITEM:
        const item = asset as Asset<AssetType.ITEM>
        return mappers.item(item)

      case AssetType.NFT:
        const nft = asset as Asset<AssetType.NFT>
        const { parcel, estate, wearable, ens } = nft.data as any

        if (parcel) {
          return mappers.parcel(nft)
        }

        if (estate) {
          return mappers.estate(nft)
        }

        if (wearable) {
          return mappers.wearable(nft)
        }

        if (ens) {
          return mappers.ens(nft)
        }
    }

    return fallback()
  }
}

export default React.memo(AssetPage)
