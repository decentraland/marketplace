import React from 'react'
import { Page } from 'decentraland-ui'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Wallet } from '../Wallet'
import { NFTProviderPage } from '../NFTProviderPage'
import { SellModal } from './SellModal'
import { Props } from './SellPage.types'
import './SellPage.css'

const SellPage = (props: Props) => {
  const { onNavigate, onCreateOrder } = props
  return (
    <>
      <Navbar isFullscreen />
      <Page className="SellPage">
        <Wallet>
          {wallet => (
            <NFTProviderPage>
              {(nft, order) => (
                <SellModal
                  nft={nft}
                  order={order}
                  wallet={wallet}
                  onNavigate={onNavigate}
                  onCreateOrder={onCreateOrder}
                />
              )}
            </NFTProviderPage>
          )}
        </Wallet>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(SellPage)
