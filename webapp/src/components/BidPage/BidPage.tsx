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
  const {
    authorizations,
    onNavigate,
    onPlaceBid,
    isPlacingBid,
    getContract
  } = props
  return (
    <>
      <Navbar isFullscreen />
      <Page className="BidPage">
        <Wallet>
          {wallet => (
            <AssetProviderPage type={AssetType.NFT}>
              {(nft, _order, rental) => (
                <BidModal
                  nft={nft}
                  rental={rental}
                  wallet={wallet}
                  authorizations={authorizations}
                  onNavigate={onNavigate}
                  onPlaceBid={onPlaceBid}
                  isPlacingBid={isPlacingBid}
                  getContract={getContract}
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
