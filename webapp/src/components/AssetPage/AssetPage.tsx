import React, { Suspense } from 'react'
import { Page } from 'decentraland-ui/dist/components/Page/Page'
import { Section } from 'decentraland-ui/dist/components/Section/Section'
import { Column } from 'decentraland-ui/dist/components/Column/Column'
import { Back } from 'decentraland-ui/dist/components/Back/Back'
import { Narrow } from 'decentraland-ui/dist/components/Narrow/Narrow'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import { Asset, AssetType } from '../../modules/asset/types'
import { locations } from '../../modules/routing/locations'
import { Sections } from '../../modules/routing/types'
import { AssetProviderPage } from '../AssetProviderPage'
import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { Footer } from '../Footer'
import { ErrorBoundary } from './ErrorBoundary'
import { Props } from './AssetPage.types'
import './AssetPage.css'

const LazyItemDetail = React.lazy(() => import('./ItemDetail'))
const LazyEmoteDetail = React.lazy(() => import('./EmoteDetail'))
const LazyParcelDetail = React.lazy(() => import('./ParcelDetail'))
const LazyEstateDetail = React.lazy(() => import('./EstateDetail'))
const LazyWearableDetail = React.lazy(() => import('./WearableDetail'))
const LazyENSDetail = React.lazy(() => import('./ENSDetail'))

const AssetPage = ({ type, isRentalsEnabled, onBack }: Props) => {
  return (
    <>
      <Navbar isFullscreen />
      <Navigation />
      <Page className="AssetPage">
        <ErrorBoundary>
          <Section>
            <Column>
              <AssetProviderPage type={type} fullWidth>
                {(asset, order, rental) => (
                  <>
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
                    <Narrow>
                      {mapAsset<React.ReactNode>(
                        asset,
                        {
                          wearable: item => (
                            <Suspense fallback={<Loader size="huge" />}>
                              <LazyItemDetail item={item} />
                            </Suspense>
                          ),
                          emote: item => (
                            <Suspense fallback={<Loader size="huge" />}>
                              <LazyItemDetail item={item} />
                            </Suspense>
                          )
                        },
                        {
                          ens: nft => (
                            <Suspense fallback={<Loader size="huge" />}>
                              <LazyENSDetail nft={nft} />
                            </Suspense>
                          ),
                          estate: nft => (
                            <Suspense fallback={<Loader size="huge" />}>
                              <LazyEstateDetail
                                nft={nft}
                                order={order}
                                rental={rental}
                                isRentalsEnabled={isRentalsEnabled}
                              />
                            </Suspense>
                          ),
                          parcel: nft => (
                            <Suspense fallback={<Loader size="huge" />}>
                              <LazyParcelDetail
                                nft={nft}
                                order={order}
                                rental={rental}
                                isRentalsEnabled={isRentalsEnabled}
                              />
                            </Suspense>
                          ),
                          wearable: nft => (
                            <Suspense fallback={<Loader size="huge" />}>
                              <LazyWearableDetail nft={nft} />
                            </Suspense>
                          ),
                          emote: nft => (
                            <Suspense fallback={<Loader size="huge" />}>
                              <LazyEmoteDetail nft={nft} />
                            </Suspense>
                          )
                        },
                        () => null
                      )}
                    </Narrow>
                  </>
                )}
              </AssetProviderPage>
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
