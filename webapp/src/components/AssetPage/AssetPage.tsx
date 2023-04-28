import React from 'react'
import { Page, Section, Column } from 'decentraland-ui'
import { mapAsset } from '../../modules/asset/utils'
import { AssetProviderPage } from '../AssetProviderPage'
import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { Footer } from '../Footer'
import { ItemDetail } from './ItemDetail'
import { ErrorBoundary } from './ErrorBoundary'
import { Props } from './AssetPage.types'
import { ParcelDetail } from './ParcelDetail'
import { EstateDetail } from './EstateDetail'
import { WearableDetail } from './WearableDetail'
import { ENSDetail } from './ENSDetail'
import { EmoteDetail } from './EmoteDetail'
import './AssetPage.css'

const AssetPage = ({ type }: Props) => {
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
                  <div className="asset-container">
                    {mapAsset<React.ReactNode>(
                      asset,
                      {
                        wearable: item => <ItemDetail item={item} />,
                        emote: item => <ItemDetail item={item} />
                      },
                      {
                        ens: nft => <ENSDetail nft={nft} />,
                        estate: nft => (
                          <EstateDetail
                            nft={nft}
                            order={order}
                            rental={rental}
                          />
                        ),
                        parcel: nft => (
                          <ParcelDetail
                            nft={nft}
                            order={order}
                            rental={rental}
                          />
                        ),
                        wearable: nft => <WearableDetail nft={nft} />,
                        emote: nft => <EmoteDetail nft={nft} />
                      },
                      () => null
                    )}
                  </div>
                )}
              </AssetProviderPage>
            </Column>
          </Section>
        </ErrorBoundary>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(AssetPage)
