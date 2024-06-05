import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Page } from 'decentraland-ui'
import { AssetType } from '../../modules/asset/types'
import { AssetProviderPage } from '../AssetProviderPage'
import { PageLayout } from '../PageLayout'
import { Wallet } from '../Wallet'
import { BidModal } from './BidModal'
import { Props } from './BidPage.types'

const BidPage = (props: Props) => {
  const { onPlaceBid, isPlacingBid, onClearBidError, getContract } = props
  const history = useHistory()

  const onNavigate = useCallback(
    (pathname: string) => {
      history.push(pathname)
    },
    [history]
  )

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
