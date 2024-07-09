import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Page } from 'decentraland-ui'
import { AssetProviderPage } from '../AssetProviderPage'
import { PageLayout } from '../PageLayout'
import { Wallet } from '../Wallet'
import { BidModal } from './BidModal'
import { Props } from './BidPage.types'

const BidPage = (props: Props) => {
  const { onPlaceBid, isPlacingBid, type, isBidsOffchainEnabled, onClearBidError, getContract } = props
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
            <AssetProviderPage type={type}>
              {(asset, _order, rental) => (
                <BidModal
                  asset={asset}
                  rental={rental}
                  wallet={wallet}
                  onNavigate={onNavigate}
                  onPlaceBid={onPlaceBid}
                  isPlacingBid={isPlacingBid}
                  getContract={getContract}
                  onClearBidError={onClearBidError}
                  isBidsOffchainEnabled={isBidsOffchainEnabled}
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
