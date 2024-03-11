import React, { useCallback } from 'react'
import { Item } from '@dcl/schemas'
import { mapAsset } from '../../modules/asset/utils'
import { Page, Section, Column } from 'decentraland-ui'
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
  const renderItemDetail = useCallback((item: Item) => <ItemDetail item={item} />, [])
  return (
    <>
      <Navbar />
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
                        wearable: renderItemDetail,
                        emote: renderItemDetail
                      },
                      {
                        ens: nft => <ENSDetail nft={nft} />,
                        estate: nft => <EstateDetail nft={nft} order={order} rental={rental} />,
                        parcel: nft => <ParcelDetail nft={nft} order={order} rental={rental} />,
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
