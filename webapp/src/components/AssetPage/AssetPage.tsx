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
import { EmoteDetail } from './EmoteDetail'
import { AssetProvider } from '../AssetProvider'
import { locations } from '../../modules/routing/locations'
import { Sections } from '../../modules/routing/types'
import './AssetPage.css'

const AssetPage = ({ type, isRentalsEnabled, onBack }: Props) => {
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
                            wearable: () =>
                              locations.browse({
                                assetType: type,
                                section: Sections.decentraland.WEARABLES
                              }),
                            emote: () =>
                              locations.browse({
                                assetType: type,
                                section: Sections.decentraland.EMOTES
                              })
                          },
                          {
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
                              }),
                            emote: () =>
                              locations.browse({
                                assetType: type,
                                section: Sections.decentraland.EMOTES
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
                    mapAsset<React.ReactNode>(
                      asset,
                      {
                        wearable: item => <ItemDetail item={item} />,
                        emote: item => <ItemDetail item={item} />
                      },
                      {
                        ens: nft => <ENSDetail nft={nft} />,
                        estate: nft => <EstateDetail nft={nft} />,
                        parcel: nft => (
                          <ParcelDetail
                            nft={nft}
                            isRentalsEnabled={isRentalsEnabled}
                          />
                        ),
                        wearable: nft => <WearableDetail nft={nft} />,
                        emote: nft => <EmoteDetail nft={nft} />
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
    itemMappers: {
      wearable: (asset: Asset<AssetType.ITEM>) => T
      emote: (asset: Asset<AssetType.ITEM>) => T
    },
    nftMappers: {
      wearable: (asset: Asset<AssetType.NFT>) => T
      emote: (asset: Asset<AssetType.NFT>) => T
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
      case AssetType.ITEM: {
        const item = asset as Asset<AssetType.ITEM>
        const { wearable, emote } = item.data as any
        if (wearable) {
          return itemMappers.wearable(item)
        }

        if (emote) {
          return itemMappers.emote(item)
        }

        break
      }

      case AssetType.NFT: {
        const nft = asset as Asset<AssetType.NFT>
        const { parcel, estate, wearable, emote, ens } = nft.data as any

        if (parcel) {
          return nftMappers.parcel(nft)
        }

        if (estate) {
          return nftMappers.estate(nft)
        }

        if (wearable) {
          return nftMappers.wearable(nft)
        }

        if (ens) {
          return nftMappers.ens(nft)
        }

        if (emote) {
          return nftMappers.emote(nft)
        }

        break
      }
    }

    return fallback()
  }
}

export default React.memo(AssetPage)
