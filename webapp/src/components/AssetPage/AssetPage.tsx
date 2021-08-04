import React from 'react'
import { Page } from 'decentraland-ui'

import { Asset } from '../../modules/routing/types'
import { ResultType } from '../../modules/asset/types'
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
      <Navigation isFullscreen />
      <Page className="AssetPage" isFullscreen>
        <AssetProviderPage type={type}>
          {asset =>
            type === ResultType.NFT ? (
              <NFTDetail nft={asset as Asset<ResultType.NFT>} />
            ) : ResultType.ITEM ? (
              <ItemDetail item={asset as Asset<ResultType.ITEM>} />
            ) : null
          }
        </AssetProviderPage>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(AssetPage)
