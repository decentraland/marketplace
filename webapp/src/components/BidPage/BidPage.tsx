import React from 'react'
import { Page } from 'decentraland-ui'
import { AssetType } from '../../modules/asset/types'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Wallet } from '../Wallet'
import { AssetProviderPage } from '../AssetProviderPage'
import { BidModal } from './BidModal'
import { Props } from './BidPage.types'

const BidPage = (props: Props) => {
  const { onNavigate, onPlaceBid, isPlacingBid, onClearBidError, getContract } = props
  return (
    <>
      <Navbar />
      <Page className="BidPage">
        <Wallet>
          {wallet => (
            <AssetProviderPage type={AssetType.NFT}>
              {(nft, _order, rental) => (
                <BidModal
                  nft={nft}
                  rental={rental}
                  wallet={wallet}
                  onNavigate={onNavigate}
                  onPlaceBid={onPlaceBid}
                  isPlacingBid={isPlacingBid}
                  getContract={getContract}
                  onClearBidError={onClearBidError}
                />
              )}
            </AssetProviderPage>
          )}
        </Wallet>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(BidPage)
