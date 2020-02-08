import React from 'react'
import { Page } from 'decentraland-ui'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Wallet } from '../Wallet'
import { NFTProviderPage } from '../NFTProviderPage'
import { BidModal } from './BidModal'
import { Props } from './BidPage.types'
import './BidPage.css'

const BidPage = (props: Props) => {
  const { onNavigate, onPlaceBid } = props
  return (
    <>
      <Navbar isFullscreen />
      <Page className="BidPage">
        <Wallet>
          {wallet => (
            <NFTProviderPage>
              {(nft, order) => (
                <BidModal
                  nft={nft}
                  order={order}
                  wallet={wallet}
                  onNavigate={onNavigate}
                  onPlaceBid={onPlaceBid}
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

export default React.memo(BidPage)
