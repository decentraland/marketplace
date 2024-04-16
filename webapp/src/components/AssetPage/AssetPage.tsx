import React, { useCallback } from 'react'
import { Item } from '@dcl/schemas'
import { Page, Section, Column } from 'decentraland-ui'
import { mapAsset } from '../../modules/asset/utils'
import { AssetProviderPage } from '../AssetProviderPage'
import { Footer } from '../Footer'
import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { EmoteDetail } from './EmoteDetail'
import { ENSDetail } from './ENSDetail'
import { ErrorBoundary } from './ErrorBoundary'
import { EstateDetail } from './EstateDetail'
import { ItemDetail } from './ItemDetail'
import { ParcelDetail } from './ParcelDetail'
import { WearableDetail } from './WearableDetail'
import { Props } from './AssetPage.types'
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
              <AssetProviderPage type={type} fullWidth withEntity>
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
