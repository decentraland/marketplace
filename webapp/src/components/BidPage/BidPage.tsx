import React from 'react'
import { Page } from 'decentraland-ui'
import { AssetType } from '../../modules/asset/types'
import { AssetProviderPage } from '../AssetProviderPage'
import { PageLayout } from '../PageLayout'
import { Wallet } from '../Wallet'
import { BidModal } from './BidModal'
import { Props } from './BidPage.types'

const BidPage = (props: Props) => {
  const { onNavigate, onPlaceBid, isPlacingBid, onClearBidError, getContract } = props
  return (
    <PageLayout>
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
    </PageLayout>
  )
}

export default React.memo(BidPage)
