import React from 'react'
import { Page, Back, Section, Column, Narrow } from 'decentraland-ui'

import { Asset, AssetType } from '../../modules/asset/types'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { AssetProviderPage } from '../AssetProviderPage'
import { NFTDetail } from '../Vendor/NFTDetail'
import { ItemDetail } from './ItemDetail'
import { Props } from './AssetPage.types'
import './AssetPage.css'

const AssetPage = (props: Props) => {
  const { type } = props
  return (
    <>
      <Navbar isFullscreen />
      <Navigation />
      <Page className="AssetPage">
        <Section>
          <Column>
            <Back className="back" absolute />
            <Narrow>
              <AssetProviderPage type={type}>
                {asset =>
                  type === AssetType.NFT ? (
                    <NFTDetail nft={asset as Asset<AssetType.NFT>} />
                  ) : AssetType.ITEM ? (
                    <ItemDetail item={asset as Asset<AssetType.ITEM>} />
                  ) : null
                }
              </AssetProviderPage>
            </Narrow>
          </Column>
        </Section>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(AssetPage)
