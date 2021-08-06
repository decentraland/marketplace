import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Loader, Stats, Button } from 'decentraland-ui'
import { Profile } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../modules/routing/locations'
import { addressEquals } from '../../modules/wallet/utils'
import { AssetType } from '../../modules/asset/types'
import { AssetProvider } from '../AssetProvider'
import { AssetImage } from '../AssetImage'
import { Mana } from '../Mana'
import { AcceptButton } from './AcceptButton'
import { WarningMessage } from './WarningMessage'
import { formatMANA } from '../../lib/mana'
import { formatDistanceToNow } from '../../lib/date'
import { Props } from './Bid.types'
import './Bid.css'

const Bid = (props: Props) => {
  const {
    bid,
    wallet,
    archivedBidIds,
    onAccept,
    onArchive,
    onUnarchive,
    onCancel,
    onUpdate,
    isArchivable,
    hasImage
  } = props

  const isArchived = archivedBidIds.includes(bid.id)
  const isBidder = !!wallet && addressEquals(wallet.address, bid.bidder)
  const isSeller = !!wallet && addressEquals(wallet.address, bid.seller)

  const handleAccept = useCallback(() => onAccept(bid), [bid, onAccept])

  return (
    <div className="Bid">
      <div className="bid-row">
        {hasImage ? (
          <div className="image">
            <AssetProvider
              type={AssetType.NFT}
              contractAddress={bid.contractAddress}
              tokenId={bid.tokenId}
            >
              {(nft, isLoading) => (
                <>
                  {!nft && isLoading ? <Loader active /> : null}
                  {nft ? (
                    <Link to={locations.nft(bid.contractAddress, bid.tokenId)}>
                      <AssetImage asset={nft} />{' '}
                    </Link>
                  ) : null}
                </>
              )}
            </AssetProvider>
          </div>
        ) : null}
        <div className="wrapper">
          <div className="info">
            <Stats className="from" title={t('bid.from')}>
              <Link to={locations.account(bid.bidder)}>
                <Profile address={bid.bidder} />
              </Link>
            </Stats>
            <Stats title={t('bid.price')}>
              <Mana>{formatMANA(bid.price)}</Mana>
            </Stats>
            <Stats title={t('bid.time_left')}>
              {formatDistanceToNow(+bid.expiresAt)}
            </Stats>
          </div>
          {isBidder || isSeller ? (
            <div className="actions">
              {isBidder ? (
                <>
                  <Button primary onClick={() => onUpdate(bid)}>
                    {t('global.update')}
                  </Button>
                  <Button onClick={() => onCancel(bid)}>
                    {t('global.cancel')}
                  </Button>
                </>
              ) : null}
              {isSeller ? (
                <>
                  <AssetProvider
                    type={AssetType.NFT}
                    contractAddress={bid.contractAddress}
                    tokenId={bid.tokenId}
                  >
                    {nft => (
                      <AcceptButton
                        nft={nft}
                        bid={bid}
                        onClick={handleAccept}
                      />
                    )}
                  </AssetProvider>

                  {isArchivable ? (
                    !isArchived ? (
                      <Button onClick={() => onArchive(bid)}>
                        {t('my_bids_page.archive')}
                      </Button>
                    ) : (
                      <Button onClick={() => onUnarchive(bid)}>
                        {t('my_bids_page.unarchive')}
                      </Button>
                    )
                  ) : null}
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      {isBidder ? (
        <AssetProvider
          type={AssetType.NFT}
          contractAddress={bid.contractAddress}
          tokenId={bid.tokenId}
        >
          {nft => <WarningMessage nft={nft} bid={bid} />}
        </AssetProvider>
      ) : null}
    </div>
  )
}

Bid.defaultProps = {
  isArchivable: true,
  hasImage: true
}

export default React.memo(Bid)
