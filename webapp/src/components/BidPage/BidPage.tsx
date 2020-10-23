import React from 'react'
import { Page } from 'decentraland-ui'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Wallet } from '../Wallet'
import { NFTProviderPage } from '../NFTProviderPage'
import { BidModal } from './BidModal'
import { Props } from './BidPage.types'

const BidPage = (props: Props) => {
  const { authorizations, onNavigate, onPlaceBid } = props
  return (
    <>
      <Navbar isFullscreen />
      <Page className="BidPage">
        <Wallet>
          {wallet => (
            <NFTProviderPage>
              {nft => (
                <BidModal
                  nft={nft}
                  wallet={wallet}
                  authorizations={authorizations}
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
